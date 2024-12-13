import { useCallback } from 'react';

import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import TextField from 'components/text-field';
import Button from 'components/button';
import Modal from 'components/modal';
import SelectBox from 'components/select-box';

import { useToaster } from 'hooks/use-toaster';

import { useInviteUser } from 'api/v1/settings/user-management';

import { emailValidate } from 'utils/validations';

import style from './login.module.scss';

const InviteModal = ({ setInviteUser, inviteUser, refetchInvites, setSeatsFull }) => {
  const {
    register,
    setError,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm();

  const { toastSuccess, toastError } = useToaster();

  // NOTE: change member role
  const { mutateAsync: _inviteUser, isLoading: isSubmitting } = useInviteUser();

  const inviteUserHandler = async (data) => {
    const formData = {
      email: data?.email,
      roleName: data?.roleName,
    };

    try {
      const res = await _inviteUser({
        body: formData,
      });
      toastSuccess(res.msg);
      setInviteUser(null);
      refetchInvites();
    } catch (error) {
      toastError(error, setError);
      setInviteUser(null);

      if (error?.msg === 'All seats occupied for this role') {
        setSeatsFull(true);
      }
    }
  };

  const handleClose = useCallback(() => setInviteUser(false), [setInviteUser]);

  const handleRegisterEmail = useCallback(
    () =>
      register('email', {
        required: 'Required',
        validate: emailValidate,
      }),
    [register],
  );

  return (
    <Modal open={inviteUser} handleClose={handleClose} className={style.mainDiv}>
      <form onSubmit={handleSubmit(inviteUserHandler)}>
        <div className={style.flex1}>
          <p className={style.p}> Invite User </p>

          <TextField
            label="Email"
            name="email"
            required
            register={handleRegisterEmail}
            placeholder="e.g., johndoe@company.com"
            type="email"
            errorMessage={errors.email && errors.email.message}
          />
          <SelectBox required control={control} name={'roleName'} label={'Role'} options={roles} />
        </div>
        <div className={style.mainBtnDiv}>
          <p onClick={handleClose} role="presentation">
            Cancel
          </p>
          <Button text={'Save'} type="submit" disabled={isSubmitting} />
        </div>
      </form>
    </Modal>
  );
};

InviteModal.propTypes = {
  setInviteUser: PropTypes.func.isRequired,
  inviteUser: PropTypes.object.isRequired, // NOTE: Adjust the PropTypes based on the actual type
  refetchInvites: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default InviteModal;

const roles = [
  { value: 'Admin', label: 'Admin' },
  { value: 'QA', label: 'QA' },
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'Developer', label: 'Developer' },
];
