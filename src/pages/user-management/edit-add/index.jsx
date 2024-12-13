import React, { useRef } from 'react';

import { Controller, useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TextField from 'components/text-field';
import Button from 'components/button';
import SelectBox from 'components/select-box';
import Modal from 'components/modal';

import { useToaster } from 'hooks/use-toaster';

import { useCreateUser, useGetUserById, useUpdateUser } from 'api/v1/settings/user-management';

import { handleFile } from 'utils/file-handler';
import { emailValidate } from 'utils/validations';

import avatar from 'assets/avatar.svg';

import style from './edit.module.scss';
import Icon from '../../../components/icon/themed-icon';

const EditAddTable = ({
  cancelEvent,
  editUserId,
  openDelModal,
  backClass,
  handleUpdatedUser, // NOTE: this must tell what to do after creating user
}) => {
  const { data: _userDataById } = useGetUserById(editUserId);

  const { mutateAsync: _createUserHandler } = useCreateUser();
  const { mutateAsync: _updateUserHandler } = useUpdateUser();
  const { toastSuccess, toastError } = useToaster();

  const {
    control,
    register,
    setValue,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const fileInputRef = useRef(null);

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const fileUpload = async (event, allowedType, name) => {
    const base64 = await handleFile(event, allowedType);
    setValue(name, base64);
  };

  React.useEffect(() => {
    if (_userDataById?.user && Object.keys(_userDataById?.user).length) {
      let values = _.pick(_userDataById?.user, ['name', 'email', 'profilePicture', 'role']);
      const roleName = values?.role;
      values = {
        ...values,
        roleName,
      };
      delete values?.role;
      Object.entries(values).forEach(([key, val]) => {
        setValue(key, val);
      });
    }
  }, [_userDataById?.user]);

  const addEditUserHandler = async (data) => {
    const formData = {
      name: data.name,
      email: data.email,
      roleName: data.roleName,
    };

    if (watch('profilePicture')) {
      formData.profilePicture = data.profilePicture;
    }

    if (editUserId) {
      try {
        const res = await _updateUserHandler({
          id: editUserId,
          body: formData,
        });
        toastSuccess(res.msg);
        handleUpdatedUser && handleUpdatedUser();
      } catch (error) {
        toastError(error, setError);
      }
    } else {
      try {
        const res = await _createUserHandler(formData);

        if (res.emailSent) {
          toastSuccess(res.msg);
          handleUpdatedUser && handleUpdatedUser();
        }
      } catch (error) {
        toastError(error, setError);
      }
    }
  };

  return (
    <Modal
      open={openDelModal || editUserId}
      handleClose={cancelEvent}
      backClass={backClass}
      className={style.modalClass}
    >
      <div>
        <div className={style.crossImg}>
          <span className={style.modalTitle}>{editUserId ? 'Edit User' : 'Add User'}</span>
          <div onClick={cancelEvent} className={style.hover}>
            <Icon name={'CrossIcon'} />
            <div className={style.tooltip}>
              <p>Cross</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(addEditUserHandler)}>
          <div className={`${style.mainEdit} `}>
            <div className={style.innerDiv}>
              <div className={style.flex} style={{ borderColor: errors?.profilePicture?.message && 'red' }}>
                <Controller
                  name="profilePicture"
                  control={control}
                  rules={{}}
                  render={() => {
                    return (
                      <>
                        <label className={style.camDiv} htmlFor="file">
                          {watch('profilePicture') ? (
                            <img src={watch('profilePicture') || avatar} alt="profilePicture" />
                          ) : (
                            <Icon name={'CameraIcon'} />
                          )}
                          <input
                            type="file"
                            id="file"
                            name="image"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={(e) => fileUpload(e, /(\.jpg|\.jpeg|\.png|\.gif)$/i, 'profilePicture')}
                          />
                        </label>
                        <div>
                          <span>Drop your file here or</span>
                          <p>Only JPEG, JPG or PNG Files are allowed upto 3 MB in size</p>
                          <Button
                            text={watch('profilePicture') ? 'Remove Profile Picture' : 'Upload Profile Picture'}
                            btnClass={style.btnClass}
                            handleClick={() => {
                              watch('profilePicture') ? setValue('profilePicture', null) : openFileInput();
                            }}
                            type={'button'}
                          />
                        </div>
                      </>
                    );
                  }}
                />
              </div>
              {errors?.profilePicture?.message && (
                <p
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    marginLeft: '5px',
                    color: ' #ff5050',
                  }}
                >
                  {errors?.profilePicture?.message}
                </p>
              )}
              <TextField
                label="Name"
                name="name"
                register={() => register('name', { required: 'Required' })}
                value={watch('name') || ''}
                placeholder="e.g., John"
                errorMessage={errors.name && errors.name.message}
              />
              <TextField
                label="Email"
                name="email"
                register={() =>
                  register('email', {
                    required: 'Required',
                    validate: emailValidate,
                  })
                }
                placeholder="e.g., johndoe@company.com"
                type="email"
                errorMessage={errors.email && errors.email.message}
              />
              <div>
                <SelectBox
                  menuPlacement="top"
                  options={options}
                  label={'Role'}
                  control={control}
                  name={'roleName'}
                  rules={{
                    required: 'Required',
                  }}
                  dynamicClass={style.zDynamic}
                  errorMessage={errors.roleName && errors.roleName.message}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <form onSubmit={handleSubmit(addEditUserHandler)}>
        <div className={style.btnSection}>
          <Button text={'Cancel'} onClick={cancelEvent} btnClass={style.discard} />
          <Button text={'Save'} type={'submit'} />
        </div>
      </form>
    </Modal>
  );
};

EditAddTable.propTypes = {
  cancelEvent: PropTypes.func.isRequired,
  editUserId: PropTypes.string,
  openDelModal: PropTypes.bool.isRequired,
  backClass: PropTypes.string.isRequired,
  handleUpdatedUser: PropTypes.func.isRequired,
};

export default EditAddTable;

const options = [
  { value: 'Admin', label: 'Admin' },
  { value: 'QA', label: 'QA' },
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'Developer', label: 'Developer' },
];
