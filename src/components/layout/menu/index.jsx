import React, { useCallback } from 'react';

import { Link } from 'react-router-dom';
import { isEqual } from 'lodash';

import Permissions from 'components/permissions';
import Icon from 'components/icon/themed-icon';

import plus from 'assets/plus.svg';
import arrow from 'assets/arrow-ticket.svg';

import style from '../layout.module.scss';
import WorkspacesSection from '../workspaces-section';

const MobileMenu = ({
  isOpen,
  setIsOpen,
  isOpen2,
  setIsOpen2,
  workspaces,
  matchingWorkspace,
  userDetails,
  selectedWorkspace,
  setSelectedWorkspace,
  isSubmitting,
  handleAddWorkspaceClick,
  changeWorkspace,
  logout,
}) => {
  const handleTerminateIsOpen = useCallback(() => setIsOpen(false), [setIsOpen]);
  const handleActivateIsOpen = useCallback(() => setIsOpen(true), [setIsOpen]);
  const handleTerminateIsOpen2 = useCallback(() => setIsOpen2(false), [setIsOpen2]);

  return (
    <div className={`${style.menuWrapper} ${isOpen ? style.open : ''}`}>
      <div className={style.menu}>
        <div className={style.userInfo}>
          {userDetails?.profilePicture ? (
            <img src={userDetails.profilePicture} height={40} width={40} alt="" />
          ) : (
            <span className={style.noNameIcon}>
              {userDetails?.name
                ?.split(' ')
                .slice(0, 2)
                .map((word) => word[0]?.toUpperCase())
                .join('')}
            </span>
          )}
          <span>{userDetails?.name}</span>
        </div>
        <Link to="/account-setting" onClick={handleTerminateIsOpen} className={style.innerFlex}>
          <p>My Setting</p>
        </Link>
        <Link to="/shortcuts" onClick={handleTerminateIsOpen} className={style.innerFlex}>
          <p>Shortcuts</p>
        </Link>
        {userDetails?.signUpType !== 'Extension' && (
          <>
            {!isOpen2 && (
              <div className={style.workspaceInfo} onClick={handleActivateIsOpen}>
                <div className={style.userNameLogo}>
                  {matchingWorkspace?.avatar ? (
                    <img src={matchingWorkspace.avatar} alt="" className={style.logo2} height={40} width={40} />
                  ) : (
                    <div className={style.nameLogoCurrent}>
                      <span>{matchingWorkspace?.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <span>{matchingWorkspace?.name}</span>
                <div>
                  <Icon name={'ArrowHeadRight'} />
                </div>
              </div>
            )}
            {isOpen2 && (
              <div className={style.allWorkspaces}>
                <div className={style.addDiv}>
                  <span onClick={handleTerminateIsOpen2}>
                    <img alt="" src={arrow} className={style.tilted_arrow} height={12} width={12} />
                    Back
                  </span>
                  <span onClick={handleAddWorkspaceClick}>
                    <img src={plus} alt="" />
                    Workspace
                  </span>
                </div>
                {workspaces
                  ?.filter((workspace) => workspace.workSpaceId !== userDetails?.lastAccessedWorkspace)
                  .map((workspace) => (
                    <WorkspacesSection
                      key={workspace.workSpaceId}
                      ele={workspace}
                      selectedWorkspace={selectedWorkspace}
                      setSelectedWorkspace={setSelectedWorkspace}
                      isSubmitting={isSubmitting}
                      changeWorkspace={changeWorkspace}
                    />
                  ))}
              </div>
            )}
          </>
        )}
        <Link to="/workspace-setting" onClick={handleTerminateIsOpen} className={style.innerFlex}>
          <p>Workspace Settings</p>
        </Link>
        <Link to="/integrations" onClick={handleTerminateIsOpen} className={style.innerFlex}>
          <p>Integrations</p>
        </Link>
        <Permissions allowedRoles={['Admin', 'Project Manager']} currentRole={userDetails?.role}>
          <Link to="/user-management" onClick={handleTerminateIsOpen} className={style.innerFlex}>
            <p>User Management</p>
          </Link>
        </Permissions>
        <Permissions
          allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
          currentRole={userDetails?.role}
          locked={userDetails?.activePlan === 'Free'}
        >
          <Link to="/activities" onClick={handleTerminateIsOpen} className={style.innerFlex}>
            <p>Activities</p>
          </Link>
        </Permissions>
        <Permissions
          allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
          currentRole={userDetails?.role}
          locked={userDetails?.activePlan === 'Free'}
        >
          <Link to="/trash" onClick={handleTerminateIsOpen} className={style.innerFlex}>
            <p>Trash</p>
          </Link>
        </Permissions>
        <div onClick={handleTerminateIsOpen} className={style.innerFlex}>
          <p>Billing</p>
        </div>
        <div className={style.logoutDiv} onClick={logout}>
          <Icon name={'LogoutBlueIcon'} />
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MobileMenu, (prevProps, nextProps) => isEqual(prevProps, nextProps));
