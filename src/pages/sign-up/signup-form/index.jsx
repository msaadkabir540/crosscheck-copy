import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import { useAuthContext } from 'context/auth-context';
import { useAppContext } from 'context/app-context';

import Button from 'components/button';
import TextField from 'components/text-field';
import Checkbox from 'components/checkbox';
import Icon from 'components/icon/themed-icon';

import { useToaster } from 'hooks/use-toaster';

import { useSignup, useGoogleSignIn } from 'api/v1/auth';

import { emailValidate } from 'utils/validations';

import GoogleIcon from 'assets/google-icon.svg';

import style from '../signup.module.scss';

const SignUpForm = () => {
  const [password, setPassword] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [signUpType, setSignUpType] = useState('AppAndExtension');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const { toastSuccess, toastError } = useToaster();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const prefilledEmail = searchParams.get('email');
  let OTP = searchParams.get('otp');
  let WS = searchParams.get('ws');
  let NEW_EMAIL = searchParams.get('email');

  const { setUserDetails } = useAppContext();
  const { setAuthToken } = useAuthContext();

  const EXTENSION = searchParams.get('extension');
  const NEW_USER = searchParams.get('newUser');

  const handleOptionClick = (option) => {
    setSignUpType(option);
  };

  useEffect(() => {
    if (EXTENSION) {
      handleOptionClick('Extension');
    }
  }, [EXTENSION]);

  const { mutateAsync: _signupHandler, isLoading: isSubmitting } = useSignup();
  const { mutateAsync: _googleSignUpHandler, isLoading: isSigningUp } = useGoogleSignIn();

  const onSubmit = async (data) => {
    try {
      const res = await _signupHandler({
        ...data,
        signUpType: NEW_USER ? 'Invitation' : signUpType,
        timeZone: userTimeZone,
      });
      toastSuccess(res.msg, { autoClose: 500 });

      if (res.emailSent) {
        navigate(
          OTP
            ? `/verify-email/${data.email}?otp=${OTP}&&ws=${WS}&&newEmail=${NEW_EMAIL}&&signUpType=${
                NEW_USER ? 'Invitation' : signUpType
              }&&user=${data.name}&&newUser=${NEW_USER}`
            : `/verify-email/${data.email}?signUpType=${NEW_USER ? 'Invitation' : signUpType}&&user=${
                data.name
              }&&newUser=${NEW_USER}`,
        );
      }
    } catch (error) {
      toastError(error);
    }
  };

  const validatePasswords = useCallback(() => {
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');

    return password === confirmPassword || "Passwords don't match";
  }, [watch]);

  const googleSignUpHandler = async (code) => {
    if (code) {
      const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
      const decodedCode = decodeURIComponent(code);

      const body = {
        code: decodedCode,
        timeZone: timeZone,
        loginType: 'AppAndExtension',
      };

      try {
        const res = await _googleSignUpHandler(body);
        setAuthToken(res?.headers?.authorization);
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...res?.data.data,
            lastAccessedWorkspace: res?.data.data?.lastAccessedWorkspace,
          }),
        );
        setUserDetails(res?.data.data);
        const data = res?.data?.data;

        if (res.status === 200) {
          res && data?.signUpType === 'AppAndExtension'
            ? data?.onboardingSuccessful
              ? navigate('/home')
              : navigate(`on-boarding/${data?.email}?name=${data.name}`)
            : navigate(`/captures`);
        }

        toastSuccess(res?.msg);
      } catch (error) {
        toastError(error);
      }
    }
  };

  const login = useGoogleLogin({
    onSuccess: (res) => {
      googleSignUpHandler(res?.access_token);
    },
    onFailure: (err) => console.error(err),
    prompt: 'select_account',
    enable_serial_consent: false,
    use_fedcm_for_prompt: false,
  });

  const handleRegisterName = useCallback(() => {
    return register('name', {
      required: 'Required',
    });
  }, [register]);

  const handleRegisterEmail = useCallback(() => {
    return register('email', {
      required: 'Required',
      validate: emailValidate,
    });
  }, [register]);

  const handleRegisterPassword = useCallback(() => {
    return register('password', { required: 'Required' });
  }, [register]);

  const handleRegisterConfirmPassword = useCallback(() => {
    return register('confirmPassword', { required: 'Required', validate: validatePasswords });
  }, [register, validatePasswords]);

  const handleRegisterAgree = useCallback(() => {
    return register('agree', {
      validate: (value) => {
        if (!value) {
          return 'Required';
        } else {
          return true;
        }
      },
    });
  }, [register]);

  const handleToggleShowPassword = useCallback(() => {
    setPassword((prev) => !prev);
  }, []);

  const handleToggleAgreed = useCallback(() => {
    setAgreed(!agreed);
  }, [agreed]);

  const handleTermsAndCondtionsNavigation = useCallback(() => {
    window.open('https://www.crosscheck.cloud/terms', '_blank');
  }, []);

  const handlePrivacyPolicyNavigation = useCallback(() => {
    window.open('https://www.crosscheck.cloud/privacy', '_blank');
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={style.card}>
        <TextField
          label="Name"
          register={handleRegisterName}
          placeholder="John Doe"
          name="name"
          type="text"
          errorMessage={errors?.name?.message}
          data-cy="signup-form-name-input"
        />
        <TextField
          label="Email"
          register={handleRegisterEmail}
          placeholder="email@address.com"
          name="email"
          type="email"
          wraperClass={style.label}
          errorMessage={errors?.email?.message}
          defaultValue={prefilledEmail || ''}
          data-cy="signup-form-email-input"
        />
        <TextField
          label="Password"
          register={handleRegisterPassword}
          placeholder={'Create a Strong Password'}
          name="password"
          type={password ? 'password' : 'text'}
          wraperClass={style.label}
          errorMessage={errors?.password?.message}
          data-cy="signup-form-password-input"
        />
        <TextField
          label="Confirm Password"
          register={handleRegisterConfirmPassword}
          placeholder={'Create a Strong Password'}
          name="confirmPassword"
          type={password ? 'password' : 'text'}
          wraperClass={style.label}
          errorMessage={errors?.confirmPassword?.message}
          data-cy="signup-form-confirm-password-input"
        />
        <div className={style.checkbox}>
          <Checkbox
            label={'Show Password'}
            containerClass={style.checkboxClass}
            handleChange={handleToggleShowPassword}
            dataCy="signup-form-checkbox-input"
          />
        </div>
        <div className={`${style.checkbox}`}>
          <Checkbox
            containerClass={style.checkboxClass}
            handleChange={handleToggleAgreed}
            dataCy="signup-form-termsconditions-checkbox"
            name="agree"
            register={handleRegisterAgree}
          />

          <h6>
            I agree to{' '}
            <span className={style.clickable_link} onClick={handleTermsAndCondtionsNavigation}>
              Terms & Conditions
            </span>{' '}
            and{' '}
            <span className={style.clickable_link} onClick={handlePrivacyPolicyNavigation}>
              {' '}
              Privacy Policy
            </span>
          </h6>
        </div>
        {errors?.agree?.message && (
          <div className={style.errorMessageWrapper}>
            <Icon name={'InfoIcon'} iconClass={style.iconClass} />
            <p>You must accept Terms & Conditions and Privacy Policy in order to continue</p>
          </div>
        )}
        <Button text={'Sign up'} disabled={isSubmitting} btnClass={style.loginBtn} data-cy="signup-form-btn-input" />
        <div className={style.divider}>
          <div className={style.leftLine}></div>

          <span className={style.text}>OR</span>
          <div className={style.rightLine}></div>
        </div>

        <Button
          text={'Continue with Google '}
          btnClass={style.googleSignUp}
          iconStart={GoogleIcon}
          onClick={login}
          type={'button'}
          disabled={isSigningUp}
        />
        <div className={style.signupDiv}>
          <p>
            Already have an account?
            <Link to="/login">
              <span> Login</span>
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default SignUpForm;
