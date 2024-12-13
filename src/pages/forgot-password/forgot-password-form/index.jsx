import { useCallback } from 'react';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import TextField from 'components/text-field';
import Button from 'components/button';

import { useToaster } from 'hooks/use-toaster';

import { useForgotPassword } from 'api/v1/auth';

import { emailValidate } from 'utils/validations';

import style from '../forgot-password.module.scss';

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const { mutateAsync: _forgotPasswordHandler } = useForgotPassword();

  const { toastSuccess, toastError } = useToaster();

  const sendEmail = async (data) => {
    try {
      const res = await _forgotPasswordHandler(data);

      if (res.emailSent) {
        toastSuccess(res.msg);
        navigate('/login');
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleRegisterEmail = useCallback(() => {
    return register('email', {
      required: 'Required',
      validate: emailValidate,
    });
  }, [register]);

  return (
    <>
      <form onSubmit={handleSubmit(sendEmail)}>
        <TextField
          label="Email"
          register={handleRegisterEmail}
          placeholder="email@address.com"
          name="email"
          type="email"
          wraperClass={style.label}
          errorMessage={errors.email && errors.email.message}
        />

        <Button text="Send Link" type={'submit'} btnClass={style.loginBtn} />
      </form>
    </>
  );
};

export default ForgotPasswordForm;
