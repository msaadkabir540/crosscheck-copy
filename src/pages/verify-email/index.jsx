import { useCallback, useEffect } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useToaster } from 'hooks/use-toaster';

import { useVerifyEmail } from 'api/v1/settings/user-management';

import style from './style.module.scss';

const VerifyEmail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useToaster();
  const { mutateAsync: _verifyEmail } = useVerifyEmail();

  const OTP = searchParams.get('otp');

  const emailVerifyHandler = useCallback(async () => {
    try {
      const res = await _verifyEmail({
        id: id,
        OTP,
      });

      if (res?.msg === 'Email Verified Successfully!') {
        toastSuccess(res.msg);
        navigate('/login');
      }
    } catch (error) {
      toastError(error);
      navigate('/login');
    }
  }, [OTP, _verifyEmail, id, navigate, toastError, toastSuccess]);

  useEffect(() => {
    emailVerifyHandler();
  }, [emailVerifyHandler]);

  return <div className={style.main}>VerifyEmail in progress please wait...</div>;
};

export default VerifyEmail;
