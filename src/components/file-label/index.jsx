import style from './fileLabel.module.scss';

const FileLabel = ({ fileName, handleClick, Icon, iconText, btnText }) => {
  return (
    <div className={style.main}>
      {fileName ? (
        <div className={style.fileName}>
          {btnText && <button>{btnText}</button>}
          <p>{fileName}</p>
        </div>
      ) : (
        <div></div>
      )}

      <div className={fileName ? style.changeIcon : style.removeIcon} onClick={handleClick}>
        <span className={style.iconText}>
          {Icon}
          {iconText}
        </span>
      </div>
    </div>
  );
};

export default FileLabel;
