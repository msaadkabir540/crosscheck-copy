import { useEffect, useRef, useState } from 'react';

import _ from 'lodash';
import { Controller } from 'react-hook-form';
import { Editor } from 'react-draft-wysiwyg';
import { convertFromRaw, EditorState, RichUtils } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'index.scss';

import num from 'assets/editor-icons/numbers.svg';
import boldIcon from 'assets/editor-icons/bold.svg';
import more from 'assets/editor-icons/more.svg';
import underline from 'assets/editor-icons/underline.svg';
import italicIcon from 'assets/editor-icons/italic.svg';
import linkIcon from 'assets/editor-icons/attach.svg';
import bulletList from 'assets/editor-icons/bullets.svg';
import iconVideo from 'assets/editor-icons/photo.svg';
import emoji from 'assets/editor-icons/emoji.svg';
import undo from 'assets/editor-icons/undo.svg';
import redo from 'assets/editor-icons/redo.svg';

import style from './editor.module.scss';

const EditorContainer = ({
  name,
  label,
  control,
  className,
  placeholder,
  errorMessage,
  defaultValue,
  rules,
  watch,
}) => {
  const ref = useRef(name);
  const [hasList, setHasList] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const hasBulletList = contentState.getBlockMap().some((block) => block.getType() === 'unordered-list-item');
    const hasNumberList = contentState.getBlockMap().some((block) => block.getType() === 'ordered-list-item');
    setHasList(hasBulletList || hasNumberList);
  }, [editorState]);

  const handleKeyCommand = (command, editorState) => {
    if (command === 'backspace') {
      const selection = editorState.getSelection();
      const content = editorState.getCurrentContent();
      const block = content.getBlockForKey(selection.getStartKey());

      if (block.getType().startsWith('ordered-list-item') || block.getType().startsWith('unordered-list-item')) {
        if (selection.getStartOffset() === 0 && selection.getEndOffset() === 0) {
          const newContent = RichUtils.tryToRemoveBlockStyle(editorState);

          if (newContent) {
            setEditorState(EditorState.push(editorState, newContent, 'remove-lists-item'));

            return 'handled';
          }
        }
      }
    }

    return 'not-handled';
  };

  useEffect(() => {
    if (defaultValue) {
      const data = defaultValue;
      Object.keys(data).length && setEditorState(EditorState.createWithContent(convertFromRaw(defaultValue)));
    }
  }, []);

  useEffect(() => {
    if (watch(name) && _.isEmpty(watch(name))) {
      setEditorState(EditorState.createEmpty());
    }
  }, [watch(name)]);

  return (
    <>
      {label && <label className={style.label}>{label}</label>}
      <div
        className={`${style.editor} ${className}`}
        style={{
          border: errorMessage ? '1px solid #ff5050' : '1px solid #d6d6d6',
          resize: 'inline',
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Controller
          name={name}
          control={control}
          rules={rules}
          defaultValue={defaultValue || null}
          render={({ field }) => {
            return (
              <Editor
                {...field}
                placeholder={hasList ? '' : placeholder ? placeholder : 'Write you text here'}
                ref={ref}
                editorState={editorState}
                toolbarClassName={style.edit}
                editorClassName={`${style.editorStyle} ${style.customListStyle}`}
                handleKeyCommand={handleKeyCommand}
                onEditorStateChange={onEditorStateChange}
                onChange={(e) => field.onChange(e)}
                onFocus={(e) => e.preventDefault()}
                toolbar={{
                  options: ['inline', 'list', 'link', 'image', 'emoji', 'history', 'remove'],
                  inline: {
                    options: ['bold', 'italic', 'underline'],
                    bold: { className: style.borderLess, icon: boldIcon },
                    italic: { className: style.borderLess, icon: italicIcon },
                    underline: {
                      className: style.borderLess,
                      icon: underline,
                    },
                  },
                  list: {
                    options: ['ordered', 'unordered'],
                    unordered: {
                      icon: bulletList,
                      className: style.borderLess,
                    },
                    ordered: { icon: num, className: style.borderLess },
                  },
                  link: {
                    inDropdown: false,
                    showOpenOptionOnHover: true,
                    defaultTargetOption: '_self',
                    options: ['link'],
                    link: { className: style.linkDecorator, icon: linkIcon },
                  },
                  image: {
                    icon: iconVideo,
                    className: style.borderLess,
                    defaultSize: {
                      height: 'auto',
                      width: 'auto',
                    },
                  },
                  emoji: {
                    icon: emoji,
                    className: style.borderLess,
                    emojis: [
                      '😀',
                      '😁',
                      '😂',
                      '😃',
                      '😉',
                      '😋',
                      '😎',
                      '😍',
                      '😗',
                      '🤗',
                      '🤔',
                      '😣',
                      '😫',
                      '😴',
                      '😌',
                      '🤓',
                      '😛',
                      '😜',
                      '😠',
                      '😇',
                      '😷',
                      '😈',
                      '👻',
                      '😺',
                      '😸',
                      '😹',
                      '😻',
                      '😼',
                      '😽',
                      '🙀',
                      '🙈',
                      '🙉',
                      '🙊',
                      '👼',
                      '👮',
                      '🕵',
                      '💂',
                      '👳',
                      '🎅',
                      '👸',
                      '👰',
                      '👲',
                      '🙍',
                      '🙇',
                      '🚶',
                      '🏃',
                      '💃',
                      '⛷',
                      '🏂',
                      '🏌',
                      '🏄',
                      '🚣',
                      '🏊',
                      '⛹',
                      '🏋',
                      '🚴',
                      '👫',
                      '💪',
                      '👈',
                      '👉',
                      '👉',
                      '👆',
                      '🖕',
                      '👇',
                      '🖖',
                      '🤘',
                      '🖐',
                      '👌',
                      '👍',
                      '👎',
                      '✊',
                      '👊',
                      '👏',
                      '🙌',
                      '🙏',
                      '🐵',
                      '🐶',
                      '🐇',
                      '🐥',
                      '🐸',
                      '🐌',
                      '🐛',
                      '🐜',
                      '🐝',
                      '🍉',
                      '🍄',
                      '🍔',
                      '🍤',
                      '🍨',
                      '🍪',
                      '🎂',
                      '🍰',
                      '🍾',
                      '🍷',
                      '🍸',
                      '🍺',
                      '🌍',
                      '🚑',
                      '⏰',
                      '🌙',
                      '🌝',
                      '🌞',
                      '⭐',
                      '🌟',
                      '🌠',
                      '🌨',
                      '🌩',
                      '⛄',
                      '🔥',
                      '🎄',
                      '🎈',
                      '🎉',
                      '🎊',
                      '🎁',
                      '🎗',
                      '🏀',
                      '🏈',
                      '🎲',
                      '🔇',
                      '🔈',
                      '📣',
                      '🔔',
                      '🎵',
                      '🎷',
                      '💰',
                      '🖊',
                      '📅',
                      '✅',
                      '❎',
                      '💯',
                    ],
                  },
                  history: {
                    options: ['undo', 'redo'],
                    undo: { icon: undo, className: style.borderLess },
                    redo: { icon: redo, className: style.borderLess },
                  },
                  remove: {
                    icon: more,
                    className: style.borderLess,
                  },
                }}
              />
            );
          }}
        />
      </div>
      {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
    </>
  );
};

export default EditorContainer;
