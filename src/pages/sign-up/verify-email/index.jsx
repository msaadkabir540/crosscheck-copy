import { useCallback, useState } from 'react';

import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useAuthContext } from 'context/auth-context';
import { useAppContext } from 'context/app-context';

import Button from 'components/button';
import AuthFooter from 'components/auth/auth-footer';
import Code from 'components/confirmation-code';
import CountdownTimer from 'components/countdown-timer';

import { useToaster } from 'hooks/use-toaster';

import { useAcceptInvite, useActivate, useResendOtp, useLogout } from 'api/v1/auth';

import crosscheckLogo from 'assets/cross-check-logo.svg';

import style from './verify.module.scss';

const VerifySignUpEmail = () => {
  const initialTimerSeconds = 300;
  const [isResendDisabled, setIsResendDisabled] = useState(initialTimerSeconds > 0);

  const { handleSubmit, setError, control } = useForm();
  const { email } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setAuthToken } = useAuthContext();
  const { setUserDetails } = useAppContext();
  const { toastSuccess, toastError } = useToaster();
  const navigate = useNavigate();

  const { mutateAsync: _activateAccountHandler, isLoading: isSubmitting } = useActivate();
  const { mutateAsync: _acceptInviteHandler } = useAcceptInvite();
  const { mutateAsync: _resendOtpHandler } = useResendOtp();
  const { mutateAsync: logoutHandler } = useLogout();

  const OTP = searchParams.get('otp');
  const WS = searchParams.get('ws');
  const SIGNUP_TYPE = searchParams.get('signUpType');
  const NAME = searchParams.get('user') || '';
  const NEW_USER = searchParams.get('newUser') || '';

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        email,
        otp: data?.otp,
      };

      const res = await _activateAccountHandler(formData);
      localStorage.setItem('accessToken', JSON.stringify(res?.headers?.authorization));
      localStorage.setItem('user', JSON.stringify(res?.data?.user));

      setAuthToken(res?.headers?.authorization);
      setUserDetails(res?.data?.user);
      toastSuccess(res?.data?.msg, { autoClose: 500 });

      if (NEW_USER && OTP) {
        await acceptHandler({ OTP, WS, email });
      }

      if (res?.status === 200) {
        let redirectUrl = '/welcome/' + email + '?name=' + NAME + '&&signUpType=' + SIGNUP_TYPE;

        if (SIGNUP_TYPE === 'AppAndExtension') {
          redirectUrl = OTP ? `/login?otp=${OTP}&ws=${WS}&newEmail=${email}` : redirectUrl;
        } else if (SIGNUP_TYPE === 'Invitation') {
          await logoutHandler();
          localStorage.clear();

          redirectUrl = `/login?user=${NEW_USER || 0}&otp=${OTP}&ws=${WS}&newEmail=${email}`;
        }

        navigate(redirectUrl);
      }
    } catch (error) {
      toastError(error, setError);
    }
  };

  const acceptHandler = async () => {
    try {
      const res = await _acceptInviteHandler({ otp: OTP, workspace: WS, email });
      toastSuccess(res?.data?.msg);
    } catch (error) {
      toastError(error);
    }
  };

  const handleTimerExpire = useCallback(() => {
    setIsResendDisabled(false);
  }, []);

  const resendOtp = async () => {
    try {
      const res = await _resendOtpHandler({ email });
      toastSuccess(res.msg);
      setSearchParams({});
      setIsResendDisabled(true);
    } catch (error) {
      toastError(error, setError);
    }
  };

  return (
    <div className={style.main}>
      <div className={style.inner}>
        <img src={crosscheckLogo} alt="" />
        <div className={style.flex}>
          <div className={style.flexLeft}>
            <h1 className={style.welcome1}>Verify your email</h1>
            <p>OTP is sent to your email </p>
          </div>
          <div className={style.card}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <p className={style.enter}>Please enter the code we emailed you.</p>
              <p className={style.emailText}>{email}</p>
              <Code className={style.codeClass} label="Confirmation Code" name={'otp'} control={control} />
              <div>
                {isResendDisabled ? (
                  <p className={style.otp}>
                    OTP will be expired in{' '}
                    <CountdownTimer initialSeconds={initialTimerSeconds} onExpire={handleTimerExpire} />
                  </p>
                ) : (
                  <p className={style.otp}>Time Expired</p>
                )}
              </div>
              <div className={style.logIn}>
                <p>Didn’t receive a code?</p>
                <span
                  className={style.btnText}
                  style={{
                    cursor: isResendDisabled ? 'not-allowed' : 'pointer',
                    color: isResendDisabled ? '#7d7d7d' : '',
                  }}
                  onClick={!isResendDisabled ? resendOtp : null}
                >
                  Resend Code
                </span>
              </div>
              <Button text={'Verify'} disabled={isSubmitting} btnClass={style.loginBtn} />
              <div className={style.signupDiv}>
                <p>
                  Already have an account?
                  <Link to="/login">
                    <span> Login</span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
};

export default VerifySignUpEmail;
