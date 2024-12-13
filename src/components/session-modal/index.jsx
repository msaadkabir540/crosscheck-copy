import { useCallback } from 'react';

import ThemedIcon from '../icon/themed-icon';
import Button from '../button';
import style from './session-modal.module.scss';

const SessionModal = ({ open }) => {
  const redirectToLogin = useCallback(() => {
    localStorage.clear();
    window.location.href = '/login';
  }, []);

  if (!open) return null;

  return (
    <div className={`${style.modalWrapper} `}>
      <div className={`${style.modalContentWrapper}`}>
        <ThemedIcon name={'WarningRedIcon'} height={60} width={60} />
        <p>Session Expired</p>
        <span>Please login again to continue using app</span>
        <Button text={'Login'} handleClick={redirectToLogin} btnClass={style.btnClass} />
      </div>
    </div>
  );
};

export default SessionModal;
