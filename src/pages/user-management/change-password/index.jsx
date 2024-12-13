import { useState } from 'react';

import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import TextField from 'components/text-field';
import Button from 'components/button';
import Modal from 'components/modal';

import { useToaster } from 'hooks/use-toaster';

import { useUpdateUserPassword } from 'api/v1/settings/user-management';

import eye from 'assets/eye.svg';

import style from './login.module.scss';

const ChangePassword = ({ setChangePassword, changePassword }) => {
  const {
    register,
    setError,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm();

  const { mutateAsync: _updatePasswordHandler } = useUpdateUserPassword();
  const { toastSuccess, toastError } = useToaster();

  const [password, setPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);

  const passwordChangeHandler = async (data) => {
    try {
      const res = await _updatePasswordHandler({
        id: changePassword,
        body: data,
      });

      setChangePassword(null);
      toastSuccess(res.msg);
    } catch (error) {
      toastError(error, setError);
    }
  };

  const validatePasswords = () => {
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');

    return password === confirmPassword || "Passwords don't match";
  };

  return (
    <form onSubmit={handleSubmit(passwordChangeHandler)}>
      <Modal open={changePassword} handleClose={() => setChangePassword(false)} className={style.mainDiv}>
        <div className={style.flex1}>
          <p className={style.p}> Change Password </p>

          <TextField
            label="New Password *"
            register={() =>
              register('password', {
                required: 'Required ',
              })
            }
            placeholder="*******"
            name="password"
            type={password ? 'text' : 'password'}
            wraperClass={style.label}
            icon={eye}
            onClick={() => setPassword((prev) => !prev)}
            errorMessage={errors.password && errors.password.message}
          />
          <TextField
            label="Confirm New Password *"
            register={() =>
              register('confirmPassword', {
                required: 'Required',
                validate: validatePasswords,
              })
            }
            placeholder="*******"
            name="confirmPassword"
            type={confirmPassword ? 'text' : 'password'}
            wraperClass={style.label}
            icon={eye}
            onClick={() => setConfirmPassword((prev) => !prev)}
            errorMessage={errors.confirmPassword && errors.confirmPassword.message}
          />
          <div className={style.mainBtnDiv}>
            <p onClick={() => setChangePassword(false)}>Cancel</p>
            <Button text={'Save Password'} type="submit" />
          </div>
        </div>
      </Modal>
    </form>
  );
};

ChangePassword.propTypes = {
  setChangePassword: PropTypes.func.isRequired,
  changePassword: PropTypes.any.isRequired,
};

export default ChangePassword;
