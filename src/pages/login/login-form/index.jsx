import React, { useCallback, useState } from 'react';

import { isEqual } from 'lodash';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import { useAuthContext } from 'context/auth-context';
import { useAppContext } from 'context/app-context';

import Button from 'components/button';
import Checkbox from 'components/checkbox';
import TextField from 'components/text-field';

import { useToaster } from 'hooks/use-toaster';

import { useLogin, useGoogleSignIn } from 'api/v1/auth';

import { emailValidate } from 'utils/validations';
import { setAuthHeaders } from 'utils/auth';

import GoogleIcon from 'assets/google-icon.svg';

import style from '../login.module.scss';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [searchParams] = useSearchParams();
  const WS = searchParams.get('ws');
  const REDIRECT_PATH = searchParams.get('redirectPath');
  const NEW_USER = searchParams.get('newUser');

  const { mutateAsync: googleLoginHandler, isLoading: isLoggingIn } = useGoogleSignIn();
  const { mutateAsync: loginHandler, isLoading: isSubmitting } = useLogin();
  const { setAuthToken } = useAuthContext();
  const { setUserDetails } = useAppContext();
  const { toastSuccess, toastError } = useToaster();
  const navigate = useNavigate();

  const handleGoogleSignUp = async (code) => {
    if (code) {
      const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
      const decodedCode = decodeURIComponent(code);
      const body = { code: decodedCode, timeZone, loginType: 'AppAndExtension' };

      try {
        const res = await googleLoginHandler(body);
        handleLoginSuccess(res, REDIRECT_PATH);
      } catch (error) {
        toastError(error);
      }
    }
  };

  const navigateBasedOnSignUpType = useCallback(
    (userData) => {
      const { signUpType, onboardingSuccessful, email, name } = userData;

      if (signUpType === 'AppAndExtension') {
        if (onboardingSuccessful) {
          navigate('/home');
        } else {
          navigate(`/on-boarding/${email}?name=${name}`);
        }
      } else if (signUpType === 'Extension') {
        navigate(`/captures`);
      }
    },
    [navigate],
  );

  const handleLoginSuccess = useCallback(
    (res, redirectPath) => {
      setAuthToken(res?.headers?.authorization);
      const userData = res?.data.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUserDetails(userData);

      setAuthHeaders(res?.headers.authorization, userData?.lastAccessedWorkspace, WS);

      if (res.status === 200) {
        if (redirectPath) {
          window.location.href = redirectPath;
        } else {
          navigateBasedOnSignUpType(userData);
        }

        toastSuccess('Successfully logged in');
      }
    },
    [toastSuccess, navigateBasedOnSignUpType, setAuthToken, WS, setUserDetails],
  );

  const handleLoginError = useCallback(
    (error, email) => {
      if (error.msg === 'Inactive account!') {
        navigate(
          `/verify-email/${email}?signUpType=${NEW_USER ? 'Invitation' : 'AppAndExtension'}&newUser=${NEW_USER}&active=true`,
        );
      } else {
        toastError(error);
      }
    },
    [toastError, navigate, NEW_USER],
  );

  const onSubmit = useCallback(
    async (data) => {
      try {
        const res = await loginHandler(data);
        handleLoginSuccess(res, REDIRECT_PATH);
      } catch (error) {
        handleLoginError(error, data.email);
      }
    },
    [handleLoginSuccess, handleLoginError, REDIRECT_PATH, loginHandler],
  );

  const login = useGoogleLogin({
    onSuccess: (res) => handleGoogleSignUp(res?.access_token),
    onFailure: (err) => toastError(err),
    prompt: 'select_account',
    enable_serial_consent: false,
    use_fedcm_for_prompt: true,
  });

  const handleRegisterEmail = useCallback(
    () => register('email', { required: 'Required', validate: emailValidate }),
    [register],
  );
  const handleRegisterPassword = useCallback(() => register('password', { required: 'Required' }), [register]);

  const handlePasswordToggle = useCallback(() => {
    setShowPassword((prevState) => !prevState);
  }, [setShowPassword]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style.flex1}>
      <TextField
        label="Email"
        register={handleRegisterEmail}
        placeholder="email@address.com"
        name="email"
        type="email"
        errorMessage={errors.email && errors.email.message}
        data-cy="login-form-email-input"
      />
      <TextField
        label="Password"
        register={handleRegisterPassword}
        placeholder="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        wraperClass={style.labelGap}
        errorMessage={errors.password && errors.password.message}
        data-cy="login-form-password-input"
      />
      <div className={style.showPasswordDiv}>
        <Checkbox label="Show Password" handleChange={handlePasswordToggle} containerClass={style.checkboxContainer} />
        <Link to="/forgot-password">
          <p className={style.forgotPassword}>Forgot Password?</p>
        </Link>
      </div>
      <Button text="Login" disabled={isSubmitting} btnClass={style.loginBtn} data-cy="login-form-btn" />

      <div className={style.divider}>
        <div className={style.leftLine}></div>
        <span className={style.text}>OR</span>
        <div className={style.rightLine}></div>
      </div>

      <Button
        text="Continue with Google"
        btnClass={style.googleSignUp}
        iconStart={GoogleIcon}
        onClick={login}
        type="button"
        disabled={isLoggingIn}
      />
      <div className={style.signupDiv}>
        <p>
          Don’t have an account?
          <Link to="/sign-up">
            <span> Signup</span>
          </Link>
        </p>
      </div>
    </form>
  );
};

export default React.memo(LoginForm, (prevProps, nextProps) => isEqual(prevProps, nextProps));
