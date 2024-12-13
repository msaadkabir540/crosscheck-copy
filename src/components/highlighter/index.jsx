import style from './highlighter.module.scss';

const Highlighter = ({ search, children }) => {
  if (!search?.trim()) {
    return <div className={style.textControl}>{children}</div>;
  }

  const text = typeof children === 'string' || typeof children === 'number' ? String(children) : children?.join('');

  const regex = new RegExp(`(${search})`, 'gi');

  const highlightedText = text?.replace(regex, (match) => `<mark style="background-color: #FFE55E;">${match}</mark>`);

  return <div dangerouslySetInnerHTML={{ __html: highlightedText }} className={style.textControl} />;
};

export default Highlighter;
