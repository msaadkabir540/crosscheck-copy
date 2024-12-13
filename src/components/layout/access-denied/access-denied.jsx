
import { useNavigate } from 'react-router-dom';

import { useAppContext } from 'context/app-context';

import Button from 'components/button';

import lock from 'assets/lock.gif';

import styles from './styles.module.scss';

const AccessDenied = () => {
  const navigate = useNavigate();
  const { userDetails } = useAppContext();

  return (
    <div className={styles.main}>
      <img className={styles.lock} src={lock} alt="" />
      <div className={styles.message}>
        <h1>Access to this page is restricted!</h1>
        <p>Please check with the site admin if you believe this is a mistake.</p>
      </div>
      <Button
        text={'Return Home'}
        className={styles.button}
        handleClick={() =>
          navigate(userDetails?.signUpType === 'Extension' ? '/captures' : '/home', {
            replace: true,
          })
        }
      />
    </div>
  );
};

export default AccessDenied;
