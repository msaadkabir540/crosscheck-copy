import { useCallback, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { useAppContext } from 'context/app-context';

import Loader from 'components/loader';

import { useGetMyWorkspaces } from 'api/v1/settings/user-management';

import style from './style.module.scss';

const Index = () => {
  const { userDetails, setUserDetails } = useAppContext();
  const SIGN_UP_MODE = userDetails?.signUpType;
  const location = useLocation();

  const { data: _getAllWorkspaces } = useGetMyWorkspaces(SIGN_UP_MODE);

  const navigateHandler = useCallback(
    ({ last, email, success }) => {
      setTimeout(() => {
        if (success === 'false') {
          window.location.href = `/on-boarding/${email}?name=${userDetails?.name}&&active=4&&success=false`;
        } else {
          window.location.href = last
            ? `/on-boarding/${email}?name=${userDetails?.name}&&active=5`
            : `/on-boarding/${email}?name=${userDetails?.name}`;
        }
      }, 2000);
    },
    [userDetails],
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const successParam = searchParams.get('success');

    const data = userDetails;

    if (_getAllWorkspaces?.workspaces?.length) {
      data.lastAccessedWorkspace = _getAllWorkspaces?.workspaces?.[0]?.workSpaceId;
      data.activePlan = _getAllWorkspaces?.workspaces?.[0]?.plan;

      localStorage.setItem('user', JSON.stringify(data));
      setUserDetails(data);
      navigateHandler({ last: true, email: data.email, success: successParam });
    }

    if (_getAllWorkspaces?.workspaces?.length === 0) {
      navigateHandler({ last: false, email: data.email, success: successParam });
    }

    if (_getAllWorkspaces?.msg === 'Workspace missing') {
      navigateHandler({ last: false, email: data.email, success: successParam });
    }
  }, [_getAllWorkspaces, location.search, navigateHandler, setUserDetails, userDetails]);

  return (
    <div className={style.main}>
      <div>
        <Loader />
      </div>
    </div>
  );
};

export default Index;
