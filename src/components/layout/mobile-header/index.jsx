
import { useLocation } from 'react-router-dom';
import _ from 'lodash';

import { useAppContext } from 'context/app-context';

import appLogo from 'assets/cross-check-icon.png';

import style from './mobile-header.module.scss';
import Icon from '../../icon/themed-icon';

const MobileHeader = ({ setIsOpen, matchingWorkspace, isOpen }) => {
  const { userDetails } = useAppContext();
  const location = useLocation(); 

  const signUpMode = userDetails?.signUpType;

  const hideHeader = location.pathname.includes('captures/');

  if (hideHeader) {
    return null;
  }

  return (
    <div className={style.mobileHeader}>
      <img src={appLogo} alt="" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => setIsOpen(true)}>
        <div className={style.imgDiv}>
          <>
            {userDetails?.profilePicture ? (
              <img src={userDetails?.profilePicture} alt="" />
            ) : (
              <span>{_.first(userDetails?.name)}</span>
            )}
          </>
          {signUpMode !== 'Extension' && (
            <>
              {matchingWorkspace?.avatar ? (
                <img src={matchingWorkspace?.avatar} alt="" />
              ) : (
                <span>{_.first(matchingWorkspace?.name)}</span>
              )}
            </>
          )}
        </div>
        <div className={style.rotateDiv} style={{ rotate: isOpen ? '-90deg' : '90deg' }}>
          <Icon name={'ArrowHeadRight'} />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
