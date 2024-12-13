import ThemedIcon from 'components/icon/themed-icon';

import style from './style.module.scss';

const Index = ({ title, preview, onClickHandler }) => {
  return (
    <div className={style.main} onClick={onClickHandler}>
      <div className={style.title}>{title} </div>
      <div className={style.preview}>
        <ThemedIcon name={preview} iconClass={style.previewIcon} />
      </div>
    </div>
  );
};

export default Index;
