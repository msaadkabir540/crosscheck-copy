import { useCallback, useState } from 'react';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';

import { useMode } from 'context/dark-mode';
import { useAppContext } from 'context/app-context';

import FloatingTimer from 'components/floating-timer';

import { useToaster } from 'hooks/use-toaster';
import useNotification from 'hooks/use-notification';

import { useChangeWorkspace, useGetMyWorkspaces, useGetUserById } from 'api/v1/settings/user-management';
import { useLogout } from 'api/v1/auth';

import MobileMenu from './menu';
import Navbar from './mobile-navbar';
import AccessDenied from './access-denied/access-denied';
import MobileHeader from './mobile-header';
import Sidebar from './sidebar';
import style from './layout.module.scss';

const Layout = ({ children, allowedRoles, specialAccess = false, currentRole, locked = false }) => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const { userDetails, setUserDetails } = useAppContext();
  const [selectedWorkspace, setSelectedWorkspace] = useState('');

  const RUN_ID = searchParams?.get('runId');
  const SIGNUP_MODE = userDetails?.signUpType;

  const { isDarkMode } = useMode();
  const { toastSuccess, toastError } = useToaster();

  const { mutateAsync: logoutHandler } = useLogout();
  const { data: workspacesData } = useGetMyWorkspaces(SIGNUP_MODE);
  const { data: userDataById, refetch } = useGetUserById(userDetails?.id || userDetails?._id);
  const { mutateAsync: changeWorkspaceHandler, isLoading: isSubmitting } = useChangeWorkspace();

  const IS_CHECK_PAGE = location.pathname.includes('captures/');

  useNotification();

  const matchingWorkspace = workspacesData?.workspaces?.find(
    (workspace) => workspace?.workSpaceId === userDetails?.lastAccessedWorkspace,
  );

  const handleAddWorkspaceClick = useCallback(() => {
    navigate(`/on-boarding/${userDetails?.email}?name=${userDetails?.name}`);
  }, [navigate, userDetails]);

  const handleWorkspaceChange = useCallback(
    async (id) => {
      try {
        const newWorkspace = workspacesData?.workspaces?.find((workspace) => workspace.workSpaceId === id);
        const res = await changeWorkspaceHandler(id);
        toastSuccess(res?.msg);

        const updatedUserDetails = {
          ...userDetails,
          plan: newWorkspace.role,
          role: newWorkspace.role,
          lastAccessedWorkspace: id,
          lastAccessedWorkspaceName: newWorkspace?.name,
          activePlan: newWorkspace.plan,
        };
        setUserDetails(updatedUserDetails);
        localStorage.setItem('user', JSON.stringify(updatedUserDetails));
        setIsOpen(false);
        setIsOpen2(false);
        navigate('/dashboard');
      } catch (error) {
        toastError(error);
      }
    },
    [changeWorkspaceHandler, navigate, setUserDetails, toastError, toastSuccess, userDetails, workspacesData],
  );

  const logout = useCallback(async () => {
    try {
      await logoutHandler();
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      toastError(error);
    }
  }, [logoutHandler, toastError]);

  const handleNavUpdate = useCallback(() => {
    navigate(`/billing`);
  }, [navigate]);

  const today = new Date();
  const targetDate = new Date(userDataById?.user?.trialEndDate);

  const differenceInMs = targetDate - today;

  const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Invalid date';
    }

    const date = new Date(dateString);

    if (isNaN(date)) {
      return 'Invalid date';
    }

    const day = date.getDate();
    const month = format(date, 'MMM');
    const year = date.getFullYear();

    return `${day}, ${month} ${year}`;
  };

  return (
    <>
      {(isDarkMode !== undefined || specialAccess) && (
        <div className={`${style.layoutWrapper} ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          {pathname.includes('/home') &&
            matchingWorkspace?.initialPlan === 'Free' &&
            differenceInDays > 0 &&
            (userDataById?.user?.role === 'Admin' || userDetails?.superAdmin) && (
              <div className={style.trialPopDiv}>
                <div className={style.trialBanner}>
                  Your Premium Trial ends after {differenceInDays} days on{' '}
                  {formatDate(userDataById?.user?.trialEndDate)} <div onClick={handleNavUpdate}>Upgrade Now</div>
                </div>
              </div>
            )}

          {userDataById?.user?.timerStartTime && !pathname.includes('/test-run/') && !RUN_ID && (
            <div className={style.floatingTimer}>
              <FloatingTimer userById={userDataById} refetch={refetch} />
            </div>
          )}
          <div className={style.mobileHeaderDiv}>
            <MobileHeader
              setIsOpen={setIsOpen}
              isOpen={isOpen}
              myWorkspaces={workspacesData?.workspaces}
              matchingWorkspace={matchingWorkspace}
            />
          </div>
          <header className={style.mobile_header}>
            <Sidebar
              pathname={pathname}
              myWorkspaces={workspacesData?.workspaces}
              matchingWorkspace={matchingWorkspace}
            />
          </header>
          {currentRole || SIGNUP_MODE === 'Extension' ? (
            <div className={`${style.sectionMargin} ${IS_CHECK_PAGE ? style.noSectionMargin : ''}`}>
              {specialAccess ? children : !locked && allowedRoles.includes(currentRole) ? children : <AccessDenied />}
            </div>
          ) : (
            ''
          )}
          {SIGNUP_MODE !== 'Extension' && (
            <footer>
              <Navbar pathname={pathname} />
            </footer>
          )}
          <MobileMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isOpen2={isOpen2}
            setIsOpen2={setIsOpen2}
            workspaces={workspacesData?.workspaces}
            matchingWorkspace={matchingWorkspace}
            userDetails={userDetails}
            selectedWorkspace={selectedWorkspace}
            setSelectedWorkspace={setSelectedWorkspace}
            isSubmitting={isSubmitting}
            handleAddWorkspaceClick={handleAddWorkspaceClick}
            changeWorkspace={handleWorkspaceChange}
            logout={logout}
          />
        </div>
      )}
    </>
  );
};

export default Layout;
