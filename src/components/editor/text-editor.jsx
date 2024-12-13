import { useRef } from 'react';

import { Controller } from 'react-hook-form';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, RichUtils, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../index.scss';
import draftToHtml from 'draftjs-to-html';

import num from 'assets/editor-icons/numbers.svg';
import boldIcon from 'assets/editor-icons/bold.svg';
import underline from 'assets/editor-icons/underline.svg';
import italicIcon from 'assets/editor-icons/italic.svg';
import linkIcon from 'assets/editor-icons/attach.svg';
import bulletList from 'assets/editor-icons/bullets.svg';
import iconVideo from 'assets/editor-icons/photo.svg';
import emoji from 'assets/editor-icons/emoji.svg';
import undo from 'assets/editor-icons/undo.svg';
import redo from 'assets/editor-icons/redo.svg';

import style from './editor.module.scss';

const TextEditor = ({ name, label, control, className, placeholder, errorMessage, rules, id }) => {
  const ref = useRef(name);

  const handleKeyCommand = (command, editorState, onChange) => {
    if (command === 'backspace') {
      const selection = editorState.getSelection();
      const content = editorState.getCurrentContent();
      const block = content.getBlockForKey(selection.getStartKey());

      if (block.getType().startsWith('ordered-list-item') || block.getType().startsWith('unordered-list-item')) {
        if (selection.getStartOffset() === 0 && selection.getEndOffset() === 0) {
          const newContent = RichUtils.tryToRemoveBlockStyle(editorState);

          if (newContent) {
            onChange(EditorState.push(editorState, newContent, 'remove-lists-item'));

            return 'handled';
          }
        }
      }
    }

    return 'not-handled';
  };

  return (
    <>
      {label && <label className={style.label}>{label}</label>}
      <div
        data-cy={`${id}${name}`}
        className={`${style.editor} ${className}`}
        style={{
          border: errorMessage ? '1px solid var(--light-red)' : '1px solid var(--stroke-a)',
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
          render={({ field }) => (
            <Editor
              toolbarClassName={style.edit}
              handleKeyCommand={(e, x) => handleKeyCommand(e, x, field.onChange)}
              editorClassName={`${style.editorStyle} ${style.customListStyle}`}
              editorState={field?.value?.editorState}
              onFocus={(e) => e.preventDefault()}
              onEditorStateChange={(editorState) => {
                const currentContent = convertToRaw(editorState.getCurrentContent());
                const html = draftToHtml(currentContent);
                field.onChange({
                  editorState,
                  description: currentContent,
                  text: currentContent?.blocks?.map((x) => x.text).join(' '),
                  html,
                });
              }}
              ref={ref}
              placeholder={
                field?.value?.description?.blocks.some(
                  (x) => x.type == 'unordered-list-item' || x.type == 'ordered-list-item',
                ) || field?.value?.description?.blocks[0]?.text
                  ? ''
                  : placeholder
                    ? placeholder
                    : 'Write you text here'
              }
              toolbar={{
                options: ['inline', 'list', 'link', 'image', 'emoji', 'history'],
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
              }}
            />
          )}
        />
      </div>
      {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
    </>
  );
};

export default TextEditor;
