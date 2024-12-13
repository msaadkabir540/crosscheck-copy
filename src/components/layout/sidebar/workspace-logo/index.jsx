import React, { useCallback } from 'react';

import style from '../sidebar.module.scss';

const WorkspaceLogo = ({ signupmode, matchingWorkspace, userDetails, setOpen }) => {
  const handleToggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const IS_APP_AND_EXTENSION_OR_INVITATION = signupmode === 'AppAndExtension' || signupmode === 'Invitation';
  const AVATAR_SRC = IS_APP_AND_EXTENSION_OR_INVITATION ? matchingWorkspace?.avatar : userDetails?.profilePicture;
  const DISPLAY_NAME = IS_APP_AND_EXTENSION_OR_INVITATION ? matchingWorkspace?.name : userDetails?.name;

  return (
    <div className={style.workSpaceLogoDiv} onClick={handleToggleOpen} data-cy="sidebar-setting-btn-icon">
      {AVATAR_SRC ? (
        <img src={AVATAR_SRC} alt="" className={style.logo2} />
      ) : (
        <span>{DISPLAY_NAME?.charAt(0)?.toUpperCase()}</span>
      )}
      <div className={style.tooltip}>
        <p>{DISPLAY_NAME}</p>
      </div>
    </div>
  );
};

export default React.memo(WorkspaceLogo);
