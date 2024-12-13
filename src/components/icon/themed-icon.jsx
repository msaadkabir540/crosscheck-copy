import { ReactSVG } from 'react-svg';

import style from './icons.module.scss';

const ThemedIcon = ({ name, white, iconClass, height, width }) => {
  return (
    <ReactSVG
      src={`/assets/${name}.svg`}
      className={`${white ? style.fillWhite : style.fill2} ${iconClass}`}
      style={{ height: height || 16, width: width || 16, pointerEvents: 'none' }}
    />
  );
};

export default ThemedIcon;
