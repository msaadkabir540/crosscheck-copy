import React, { useCallback, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { isEqual } from 'lodash';

import { useAppContext } from 'context/app-context';

import Icon from 'components/icon/themed-icon';

import { useToaster } from 'hooks/use-toaster';

import { useLogout } from 'api/v1/auth';

import home from 'assets/home.svg';
import bag from 'assets/bag.svg';
import testRunLogo from 'assets/testRunLogo.svg';
import setting from 'assets/setting.svg';
import dashboard from 'assets/dashboard.svg';
import captures from 'assets/captures.svg';
import test from 'assets/test-case.svg';

import style from './sidebar.module.scss';
import Workspace from './workspace';
import NavigationMenu from './route-options';
import WorkspaceLogo from './workspace-logo';

const routes = [
  {
    tooltip: 'Home',
    icon: home,
    path: '/home',
    noPath: false,
    mode: ['Invitation', 'AppAndExtension'],
  },
  {
    tooltip: 'Projects',

    icon: bag,
    path: '/projects',
    noPath: false,
    mode: ['Invitation', 'AppAndExtension'],
  },
  {
    tooltip: 'Test Cases',
    icon: test,
    path: '/test-cases',
    noPath: false,
    mode: ['Invitation', 'AppAndExtension'],
  },
  {
    tooltip: 'Test Run',

    icon: testRunLogo,
    noPath: false,
    mode: ['Invitation', 'AppAndExtension'],
    path: '/test-run',
  },
  {
    tooltip: 'Bug Reporting',

    icon: setting,
    noPath: false,
    mode: ['Invitation', 'AppAndExtension'],
    path: '/qa-testing',
  },
  {
    tooltip: 'Checks',
    icon: captures,
    noPath: false,
    mode: ['Extension', 'Invitation', 'AppAndExtension'],
    path: '/captures',
  },
  {
    tooltip: 'Dashboards',
    icon: dashboard,
    noPath: false,
    mode: ['Invitation', 'AppAndExtension'],
    path: '/dashboards',
  },
];

const Sidebar = ({ pathname, myWorkspaces, matchingWorkspace }) => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const { toastError } = useToaster();
  const { userDetails } = useAppContext();
  const navigate = useNavigate();

  const SIGN_UP_MODE = userDetails?.signUpType;

  const { mutateAsync: _logoutHandler } = useLogout();

  const handleAddWorkSpaceClick = useCallback(() => {
    const url = `/on-boarding/${userDetails?.email}?name=${userDetails.name}`;
    navigate(url);
  }, [navigate, userDetails]);

  const handleChangeWorkSpaceClick = useCallback(() => {
    const url = `/dashboard`;
    navigate(url);
  }, [navigate]);

  const logoutFunc = useCallback(async () => {
    try {
      await _logoutHandler();
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      toastError(error);
    }
  }, [_logoutHandler, toastError]);

  const filteredRoutes = routes?.filter((route) => {
    return SIGN_UP_MODE && route?.mode?.includes(SIGN_UP_MODE);
  });

  return (
    <div className={style.projectsFlex}>
      <>
        <div className={style.sidebar}>
          <div className={style.logoDiv}>
            <div className={style.imgDiv}>
              {}
              <Icon name={'WhiteX'} height={51.82} width={40} />
            </div>
            <div className={style.line} />

            <WorkspaceLogo
              signupmode={SIGN_UP_MODE}
              matchingWorkspace={matchingWorkspace}
              userDetails={userDetails}
              setOpen={setOpen}
            />

            {filteredRoutes?.map((ele, index) =>
              ele?.noPath ? (
                <div
                  className={style.routes}
                  key={ele?.path}
                  style={{
                    backgroundColor:
                      open ||
                      pathname === '/account-setting' ||
                      pathname === '/notifications-setting' ||
                      pathname === '/workspace-setting' ||
                      pathname === '/user-management' ||
                      pathname === '/activities' ||
                      pathname === '/trash' ||
                      pathname === '/integrations' ||
                      pathname === '/shortcuts'
                        ? 'var(--active)'
                        : '',
                  }}
                >
                  <img src={ele.icon} onClick={ele.click && ele.click} height={24} width={24} alt="" />
                  <div className={style.tooltip}>
                    <p>{ele.tooltip}</p>
                  </div>
                </div>
              ) : (
                <div
                  key={ele.path}
                  className={`${style.routes} ${
                    (pathname.startsWith(ele.path) && !ele.noPath && !open) ||
                    (ele.path === '/qa-testing' && pathname.startsWith('/bug-testing'))
                      ? style.addBackgroundClass
                      : ''
                  }`}
                >
                  <Link to={ele.path}>
                    <img
                      src={ele.icon}
                      alt=""
                      onClick={ele.click && ele.click}
                      data-cy={`dashboard-sidebar-project-icon${index}`}
                    />
                  </Link>
                  <div className={style.tooltip}>
                    <p>{ele.tooltip}</p>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className={style.logoutDiv} onClick={logoutFunc} data-cy="sidebar-logout-btn">
            <Icon name={'LogoutIcon'} iconClass={style.icon} />
            <div className={style.tooltip}>
              <p>Logout</p>
            </div>
          </div>
        </div>
        {open && (
          <NavigationMenu
            userDetails={userDetails}
            matchingWorkspace={matchingWorkspace}
            signUpMode={SIGN_UP_MODE}
            setOpen={setOpen}
            setOpen2={setOpen2}
            open2={open2}
          />
        )}
        <Workspace
          open={open}
          open2={open2}
          setOpen={setOpen}
          setOpen2={setOpen2}
          myWorkspaces={myWorkspaces}
          matchingWorkspace={matchingWorkspace}
          handleAddWorkSpaceClick={handleAddWorkSpaceClick}
          handleChangeWorkSpaceClick={handleChangeWorkSpaceClick}
        />
      </>
    </div>
  );
};

export default React.memo(Sidebar, (prevProps, nextProps) => isEqual(prevProps, nextProps));
