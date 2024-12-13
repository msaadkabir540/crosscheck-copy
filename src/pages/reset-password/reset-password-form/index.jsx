import { useCallback, useState } from 'react';

import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import TextField from 'components/text-field';
import Button from 'components/button';
import Checkbox from 'components/checkbox';

import { useToaster } from 'hooks/use-toaster';

import { useResetPassword } from 'api/v1/auth';

import arrow from 'assets/arrow-ticket-white.svg';

import style from '../reset-password.module.scss';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const navigate = useNavigate();

  const { toastSuccess, toastError } = useToaster();
  const { mutateAsync: _restPasswordHandler } = useResetPassword();

  const searchParams = new URLSearchParams(location.search);
  const OTP = searchParams.get('otp');

  const resetPasswordHandler = async (data) => {
    try {
      if (!OTP) {
        return toastError({
          msg: `Please use the link sent to your email to reset password`,
          status: 404,
        });
      }

      const res = await _restPasswordHandler({
        passwordResetOtp: OTP,
        ...data,
      });
      toastSuccess(res?.msg);
      navigate('/login');
    } catch (error) {
      toastError(error, setError);
    }
  };

  const validatePasswords = useCallback(() => {
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');

    return password === confirmPassword || "Passwords don't match";
  }, [watch]);

  const handleRegisterPassword = useCallback(() => {
    return register('password', {
      required: 'Required ',
    });
  }, [register]);

  const handleRegisterConfirmPassword = useCallback(() => {
    return register('confirmPassword', {
      required: 'Required ',
      validate: validatePasswords,
    });
  }, [register, validatePasswords]);

  const handleShowPasswordToggle = useCallback(() => {
    setPassword((prev) => !prev);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(resetPasswordHandler)} className={style.flex1}>
        <Link to="/forgot-password">
          <div className={style.innerFlex}>
            <img src={arrow} alt="arrow icon" />
            <p>Back </p>
          </div>
        </Link>
        <TextField
          label="New Password"
          register={handleRegisterPassword}
          placeholder="Enter you password"
          name="password"
          type={password ? 'text' : 'password'}
          errorMessage={errors.password && errors.password.message}
        />
        <TextField
          label="Confirm  Password"
          register={handleRegisterConfirmPassword}
          placeholder="Enter you password"
          name="confirmPassword"
          type={password ? 'text' : 'password'}
          wraperClass={style.label}
          errorMessage={errors.confirmPassword && errors.confirmPassword.message}
        />
        <div className={style.checkboxChildContainer}>
          <Checkbox
            label={'Show Password'}
            handleChange={handleShowPasswordToggle}
            containerClass={style.checkboxContainer}
          />
        </div>
        <Button text="Confirm Password" type={'submit'} btnClass={style.loginBtn} />
      </form>
    </>
  );
};

export default ResetPasswordForm;
