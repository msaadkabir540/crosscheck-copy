import { envObject } from 'constants/environmental';

import errorBoundaryIcon from 'assets/error-boundary-icon.svg';

import style from './style.module.scss';
import Icon from '../../icon/themed-icon';

const ErrorUI = () => {
  const { BASE_URL } = envObject;

  return (
    <div className={style.mainWrapper}>
      <div className={style.logo}>
        <Icon name={'CrossCheckIcon'} />
      </div>
      <div className={style.container}>
        <img src={errorBoundaryIcon}></img>

        <div className={style.textWrapper}>
          <div className={style.title}>Oops. Something Went Wrong!</div>
          <div className={style.description}>The page you’re looking for does not seem to exist</div>
        </div>
        <a className={style.btn} href={BASE_URL}>
          <span>Back to Home</span>
        </a>
      </div>
    </div>
  );
};

export default ErrorUI;
