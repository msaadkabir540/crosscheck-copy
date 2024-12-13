import React, { useCallback } from 'react';

import { createPortal } from 'react-dom';
import { isEqual } from 'lodash';

import Permissions from 'components/permissions';
import Icon from 'components/icon/themed-icon';

import style from '../sidebar.module.scss';
import UserInfo from '../user-info';
import NavigationLink from '../navigation-link';

const NavigationMenu = ({ userDetails, matchingWorkspace, signUpMode, setOpen, setOpen2, open2 }) => {
  const handleMenuClose = useCallback(() => {
    setOpen(false);
    setOpen2(false);
  }, [setOpen, setOpen2]);

  const toggleWorkspaceShortcuts = useCallback(() => {
    setOpen2((prev) => !prev);
  }, [setOpen2]);
  const portalRoot = document.getElementById('portal-root');

  return createPortal(
    <div className={style.position}>
      <UserInfo userDetails={userDetails} />
      <NavigationLink to="/account-setting" onClick={handleMenuClose} className={style.innerFlex}>
        <p>My Setting</p>
      </NavigationLink>
      <NavigationLink to="/notifications-setting" onClick={handleMenuClose} className={style.innerFlex}>
        <p>Notifications Setting</p>
      </NavigationLink>
      <NavigationLink to="/shortcuts" onClick={handleMenuClose} className={style.innerFlex}>
        <p>Shortcuts</p>
      </NavigationLink>
      {(signUpMode === 'AppAndExtension' || signUpMode === 'Invitation') && (
        <div className={style.userInfo} onClick={toggleWorkspaceShortcuts} data-cy="sidebar-workspace-shortcuts">
          <div className={style.userNameLogo}>
            {matchingWorkspace?.avatar ? (
              <img src={matchingWorkspace?.avatar} alt="" className={style.logo2} height={40} width={40} />
            ) : (
              <div className={style.nameLogoCurrent}>
                <span>{matchingWorkspace?.name?.charAt(0)?.toUpperCase()}</span>
              </div>
            )}
          </div>
          <span className={style.matchingWSname}>{matchingWorkspace?.name}</span>
          <div>
            <Icon name={'ArrowHeadRight'} />
          </div>
          {matchingWorkspace?.name?.length > 10 && open2 !== true && (
            <div className={style.tooltipWs}>
              <p>{matchingWorkspace?.name}</p>
            </div>
          )}
        </div>
      )}
      <Permissions allowedRoles={['Admin', 'Owner']} currentRole={userDetails?.role}>
        <div onClick={handleMenuClose} className={style.innerFlex}>
          <NavigationLink to="/workspace-setting" onClick={handleMenuClose} className={style.innerFlex}>
            <p>Workspace Settings</p>
          </NavigationLink>
        </div>
      </Permissions>
      <Permissions allowedRoles={['Admin', 'Project Manager']} currentRole={userDetails?.role}>
        <NavigationLink to="/user-management" onClick={handleMenuClose} className={style.innerFlex}>
          <p>User Management</p>
        </NavigationLink>
      </Permissions>
      <NavigationLink to="/integrations" onClick={handleMenuClose} className={style.innerFlex}>
        <p>Integrations</p>
      </NavigationLink>
      <Permissions
        locked={userDetails?.activePlan === 'Free'}
        allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
        currentRole={userDetails?.role}
      >
        <NavigationLink to="/activities" onClick={handleMenuClose} className={style.innerFlex}>
          <p>Activities</p>
        </NavigationLink>
      </Permissions>
      <Permissions
        locked={userDetails?.activePlan === 'Free'}
        allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
        currentRole={userDetails?.role}
      >
        <NavigationLink to="/trash" onClick={handleMenuClose} className={style.innerFlex}>
          <p>Trash</p>
        </NavigationLink>
      </Permissions>

      <Permissions
        locked={userDetails?.activePlan === 'Free'}
        allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
        currentRole={userDetails?.role}
      >
        <NavigationLink to="/api-token" onClick={handleMenuClose} className={style.innerFlex}>
          <p>API Token</p>
        </NavigationLink>
      </Permissions>

      <Permissions allowedRoles={['Admin']} currentRole={userDetails?.role}>
        <NavigationLink to="/billing" onClick={handleMenuClose} className={style.innerFlex}>
          <p>Billing</p>
        </NavigationLink>
      </Permissions>
      <Permissions allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']} currentRole={userDetails?.role}>
        <NavigationLink to="/captures" onClick={handleMenuClose} className={style.innerFlex}>
          <p>Captures</p>
        </NavigationLink>
      </Permissions>
      <NavigationLink to="/tip-tap" onClick={handleMenuClose} className={style.innerFlex}>
        <p>Tip Tap</p>
      </NavigationLink>
    </div>,
    portalRoot,
  );
};

export default React.memo(NavigationMenu, (prevProps, nextProps) => isEqual(prevProps, nextProps));
