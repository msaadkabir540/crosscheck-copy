import { useCallback, useEffect } from 'react';

import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import Button from 'components/button';
import Modal from 'components/modal';
import SelectBox from 'components/select-box';

import { useToaster } from 'hooks/use-toaster';

import { useUpdateUserRole } from 'api/v1/settings/user-management';

import style from './login.module.scss';

const ChangeRole = ({ setChangeRole, changeRole, refetch, setOpenMenu, setUsers }) => {
  const { setError, setValue, control, handleSubmit } = useForm();

  const { toastSuccess, toastError } = useToaster();

  // NOTE: change member role
  const { mutateAsync: _updateUserRoleHandler, isLoading: isSubmitting } = useUpdateUserRole();

  const addEditUserRoleHandler = async (data) => {
    const formData = {
      roleName: data?.roleName,
    };

    try {
      const res = await _updateUserRoleHandler({
        id: changeRole?.id,
        body: formData,
      });
      toastSuccess(res.msg);
      setUsers({});
      await refetch();
      setChangeRole(null);
      setOpenMenu(false);
    } catch (error) {
      toastError(error, setError);
    }
  };

  useEffect(() => {
    changeRole.role && setValue('roleName', changeRole.role === 'Owner' ? 'Admin' : changeRole.role);
  }, [changeRole, setValue]);

  const handleCancel = useCallback(() => setChangeRole(null), [setChangeRole]);

  return (
    <Modal open={changeRole?.id} handleClose={handleCancel} className={style.mainDiv}>
      <form onSubmit={handleSubmit(addEditUserRoleHandler)}>
        <div className={style.flex1}>
          <p className={style.p}> Change Role </p>
          <div className={style.dynamicSelectBox}>
            <SelectBox required control={control} name={'roleName'} label={'Role'} options={roles} />
          </div>
        </div>
        <div className={style.mainBtnDiv}>
          <p onClick={handleCancel}>Cancel</p>
          <Button text={'Save'} type="submit" disabled={isSubmitting} />
        </div>
      </form>
    </Modal>
  );
};

ChangeRole.propTypes = {
  setChangeRole: PropTypes.func.isRequired,
  changeRole: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  setOpenMenu: PropTypes.func.isRequired,
  setUsers: PropTypes.func.isRequired,
};

export default ChangeRole;

const roles = [
  { value: 'Admin', label: 'Admin' },
  { value: 'QA', label: 'QA' },
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'Developer', label: 'Developer' },
];
