import { useCallback, useEffect, useState } from 'react';

import { EditorContent, FloatingMenu, useEditor, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import { useForm } from 'react-hook-form';

import Button from '../button';
import Switch from '../switch';
import TextField from '../text-field';
import style from './tip-tap.module.scss';
import ThemedIcon from '../icon/themed-icon';

const Tiptap = () => {
  const { control } = useForm();
  const [isEditable, setIsEditable] = useState(true);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Strike,
      Underline,
      Color,
      Highlight,
      OrderedList,
      BulletList,
      Link,
      TextStyle,
    ],
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable);
    }
  }, [isEditable, editor]);

  const addLink = useCallback(() => {
    if (linkUrl) {
      const href = linkUrl.match(/^https?:\/\//) ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().setLink({ href }).run();
    }

    setLinkUrl('');
    setShowLinkModal(false);
  }, [linkUrl, editor]);

  const removeLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  const openLinkModal = useCallback(() => {
    if (editor.isActive('link')) {
      const currentUrl = editor.getAttributes('link').href;
      setLinkUrl(currentUrl);
    } else {
      setLinkUrl('');
    }

    setShowLinkModal(true);
  }, [editor]);

  const toggleEditable = useCallback(() => {
    setIsEditable((prevIsEditable) => !prevIsEditable);
  }, []);

  const handleColorInput = useCallback(
    (event) => {
      editor.chain().focus().setColor(event.target.value).run();
    },
    [editor],
  );

  const handleToggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const handleToggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const handleToggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const handleToggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const handleSetHighlight = useCallback(() => {
    editor.chain().focus().setHighlight({ color: '#FFFF00' }).run();
  }, [editor]);

  const handleUnsetHighlight = useCallback(() => {
    editor.chain().focus().unsetHighlight().run();
  }, [editor]);

  const handleToggleBulletList = useCallback(() => {
    editor.chain().focus().toggleBulletList().run();
  }, [editor]);

  const handleToggleOrderedList = useCallback(() => {
    editor.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const handleLinkUrlChange = useCallback(
    (e) => {
      setLinkUrl(e.target.value);
    },
    [setLinkUrl],
  );

  const handleLinkClick = useCallback(() => {
    if (editor.isActive('link')) {
      removeLink();
    } else {
      openLinkModal();
    }
  }, [editor, removeLink, openLinkModal]);

  const handleUndo = useCallback(() => {
    editor.chain().focus().undo().run();
  }, [editor]);

  const handleRedo = useCallback(() => {
    editor.chain().focus().redo().run();
  }, [editor]);

  const handleCloseLinkModal = useCallback(() => setShowLinkModal(false), []);

  return (
    <div className={style.editorContainer}>
      <div className={style.toolbar}>
        <div className={style.switchDiv}>
          <span>Editable</span>
          <Switch control={control} name={'switch'} checked={isEditable} handleSwitchChange={toggleEditable} />
        </div>
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className={style.bubbleMenu}>
              <input
                type="color"
                onInput={handleColorInput}
                value={editor.getAttributes('textStyle').color || '#000000'}
                data-testid="setColor"
                className={style.colorPallet}
              />
              <div className={style.separator} />
              <div
                onClick={handleToggleBold}
                className={`${editor.isActive('bold') ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'bold-icon'} iconClass={`${style.filled} ${style.pointer}`} />
              </div>

              <div
                onClick={handleToggleItalic}
                className={`${editor.isActive('italic') ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'italic-icon'} iconClass={style.pointer} />
              </div>
              <div
                onClick={handleToggleStrike}
                className={`${editor.isActive('strike') ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'strike-text-icon'} iconClass={style.pointer} />
              </div>
              <div
                onClick={handleToggleUnderline}
                className={`${editor.isActive('underline') ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'underline'} iconClass={style.pointer} />
              </div>
              <div className={style.separator} />

              <div
                onClick={handleSetHighlight}
                className={`${editor.getAttributes('highlight').color === '#FFFF00' ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'highlighter'} iconClass={style.pointer} />
              </div>
              <div onClick={handleUnsetHighlight} className={` ${style.bubbleBtn}`}>
                <ThemedIcon name={'unhighlight'} iconClass={style.pointer} />
              </div>
              <div className={style.separator} />

              <div
                onClick={handleToggleBulletList}
                className={`${editor.isActive('bulletList') ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'bullet'} iconClass={style.pointer} />
              </div>
              <div
                onClick={handleToggleOrderedList}
                className={`${editor.isActive('orderedList') ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'number-list'} iconClass={`${style.filled} ${style.pointer}`} />
              </div>
              <div className={style.separator} />

              <div
                onClick={handleLinkClick}
                className={`${editor.isActive('link') ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'add-url'} iconClass={style.pointer} />
              </div>
            </div>
          </BubbleMenu>
        )}
        <div className={style.undoRedo}>
          <div onClick={handleUndo}>
            <ThemedIcon name={'undo'} iconClass={style.pointer} />
          </div>
          <div onClick={handleRedo}>
            <ThemedIcon name={'redo'} iconClass={style.pointer} />
          </div>
        </div>
      </div>
      <div className={style.editor}>
        {editor && (
          <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className={style.bubbleMenu}>
              <input
                type="color"
                onInput={handleColorInput}
                value={editor.getAttributes('textStyle').color || '#000000'}
                data-testid="setColor"
                className={style.colorPallet}
              />
              <div className={style.separator} />
              <div
                onClick={handleToggleBold}
                className={`${editor.isActive('bold') ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'bold-icon'} iconClass={`${style.filled} ${style.pointer}`} />
              </div>

              <div
                onClick={handleToggleItalic}
                className={`${editor.isActive('italic') ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'italic-icon'} iconClass={style.pointer} />
              </div>
              <div
                onClick={handleToggleStrike}
                className={`${editor.isActive('strike') ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'strike-text-icon'} iconClass={style.pointer} />
              </div>
              <div
                onClick={handleToggleUnderline}
                className={`${editor.isActive('underline') ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'underline'} iconClass={style.pointer} />
              </div>
              <div className={style.separator} />

              <div
                onClick={handleSetHighlight}
                className={`${editor.getAttributes('highlight').color === '#FFFF00' ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'highlighter'} iconClass={style.pointer} />
              </div>
              <div onClick={handleUnsetHighlight} className={` ${style.bubbleBtn}`}>
                <ThemedIcon name={'unhighlight'} iconClass={style.pointer} />
              </div>
              <div className={style.separator} />

              <div
                onClick={handleToggleBulletList}
                className={`${editor.isActive('bulletList') ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'bullet'} iconClass={style.pointer} />
              </div>
              <div
                onClick={handleToggleOrderedList}
                className={`${editor.isActive('orderedList') ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'number-list'} iconClass={`${style.filled} ${style.pointer}`} />
              </div>
              <div className={style.separator} />

              <div
                onClick={handleLinkClick}
                className={`${editor.isActive('link') ? style.btnActive : ''} ${style.bubbleBtn}`}
              >
                <ThemedIcon name={'add-url'} iconClass={style.pointer} />
              </div>
            </div>
          </FloatingMenu>
        )}
        <EditorContent editor={editor} placeholder={'Enter text here...'} />
      </div>

      {showLinkModal && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <TextField
              label={'Add Link'}
              onChange={handleLinkUrlChange}
              value={linkUrl}
              placeholder={'Enter URL here'}
            />
            <div className={style.btnDiv}>
              <Button text={'Add'} handleClick={addLink} />
              <Button text={'Cancel'} handleClick={handleCloseLinkModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tiptap;
