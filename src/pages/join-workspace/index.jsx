import { useCallback, useEffect, useState } from 'react';

import { Link, useSearchParams } from 'react-router-dom';

import Button from 'components/button';
import Loader from 'components/loader';

import { useToaster } from 'hooks/use-toaster';

import { useAcceptInvite } from 'api/v1/auth';

import style from './join.module.scss';

const JoinWorkspace = () => {
  const { toastSuccess, toastError } = useToaster();
  const [newUser, setNewUser] = useState(false);

  const [searchParams] = useSearchParams();
  const OTP = searchParams.get('otp');
  const WS = searchParams.get('ws');
  const EMAIL = searchParams.get('email');

  const { mutateAsync: _acceptInviteHandler, isLoading: _isSubmitting } = useAcceptInvite();

  const acceptHandler = useCallback(async () => {
    const formData = {
      otp: OTP,
      workspace: WS,
      email: EMAIL,
    };

    try {
      const res = await _acceptInviteHandler({ ...formData });
      toastSuccess(res?.data?.msg);
    } catch (error) {
      toastError(error);

      if (error?.status === 404) {
        setNewUser(true);
      }
    }
  }, [OTP, EMAIL, WS, _acceptInviteHandler, toastError, toastSuccess]);

  useEffect(() => {
    acceptHandler();
  }, []);

  return (
    <>
      {_isSubmitting ? (
        <Loader />
      ) : (
        <div className={style.main}>
          {newUser && <span>You&apos;re not a member yet, Please sign up. 😶</span>}
          {!newUser && <span>Workspace joined!🎉</span>}
          {newUser && (
            <Link to={`/sign-up?otp=${OTP}&&ws=${WS}&&email=${EMAIL}&&newUser=1`}>
              <Button text={'Go to Sign up'} />
            </Link>
          )}
          {!newUser && (
            <Link to={localStorage.getItem('accessToken') ? `/dashboard` : '/login'}>
              <Button text={'Go to Dashboard'} />
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default JoinWorkspace;
