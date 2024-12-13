import React, { useCallback, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import _ from 'lodash';

import { useMode } from 'context/dark-mode';
import { useAppContext } from 'context/app-context';

import Button from 'components/button';
import RadioButtons from 'components/form-fields/radio-buttons';
import Switch from 'components/switch';
import Loader from 'components/loader';
import TextField from 'components/text-field';
import SelectBox from 'components/select-box';
import IntegrationCard from 'components/integration-card';
import MainWrapper from 'components/layout/main-wrapper';

import { useToaster } from 'hooks/use-toaster';

import {
  useGetUserById,
  useGetMyWorkspaces,
  useUpdateAccount,
  useChangeWorkspace,
  useChangeDefaultStorage,
} from 'api/v1/settings/user-management';

import { handleFile } from 'utils/file-handler';
import { timeZones } from 'utils/time-zone';
import { formattedDate } from 'utils/date-handler';

import style from './account-settings.module.scss';

const AccountSetting = () => {
  const { setError, register, setValue, watch, handleSubmit, control } = useForm();
  const [initialUserData, setInitialUserData] = useState(null);
  const { mutateAsync: _updateAccountHandler, isLoading } = useUpdateAccount();
  const { userDetails, updateUserDetails, setUserDetails } = useAppContext();
  const [isFormDirty, setIsFormDirty] = useState(false);
  const { toastSuccess, toastError } = useToaster();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const signUpMode = userDetails?.signUpType;
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const { mutateAsync: _defaultStorageChangeHandler, isLoading: _isStorageLoading } = useChangeDefaultStorage();

  const handleInputChange = () => {
    setIsFormDirty(true);
  };

  const openFileInput = () => {
    fileInputRef?.current?.click();
  };

  const fileUpload = async (event, allowedType, name) => {
    const base64 = await handleFile(event, allowedType);
    setValue(name, base64);
  };

  const logoutUser = () => {
    localStorage.removeItem('accessToken');
    window.location.reload();
  };

  const { data: _userDataById, refetch } = useGetUserById(userDetails?.id);

  const { data: _getAllWorkspaces } = useGetMyWorkspaces(signUpMode);

  React.useEffect(() => {
    if (_userDataById?.user && Object.keys(_userDataById?.user).length) {
      setInitialUserData(_userDataById?.user);
      let values = _.pick(_userDataById?.user, [
        'name',
        'email',
        'profilePicture',
        'clickUpUserId',
        'timeZone',
        'checksDefaultStorage',
      ]);
      values = {
        ...values,
        defaultStorage: values.checksDefaultStorage,
      };

      updateUserDetails((pre) => ({
        ...pre,
        name: values?.name,
        email: values?.email,
        ...(values?.profilePicture && {
          profilePicture: values?.profilePicture,
          defaultStorage: values.checksDefaultStorage,
        }),
      }));
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...userDetails,
          name: values?.name,
          email: values?.email,
          ...(values?.profilePicture && {
            profilePicture: values?.profilePicture,
          }),
          googleDriveAccessToken: values.googleDriveAccessToken,
          defaultStorage: values.checksDefaultStorage,
        }),
      );
      Object.entries(values).forEach(([key, val]) => {
        setValue(key, val);
      });
    }
  }, [_userDataById?.user]);

  const addEditUserHandler = async (data) => {
    const formData = {
      name: data.name,
      email: data.email,
      timeZone: data.timeZone,
    };

    if (watch('profilePicture')) {
      formData.profilePicture = data.profilePicture;
    }

    if (watch('newPassword')) {
      formData.newPassword = data.newPassword;
    }

    if (watch('confirmPassword')) {
      formData.confirmPassword = data.confirmPassword;
    }

    try {
      const res = await _updateAccountHandler({
        body: formData,
      });

      if (res?.emailSent) {
        logoutUser();
      }

      setUserDetails({
        ...userDetails,
        profilePicture: watch('profilePicture'),
      });
      await refetch();
      toastSuccess(res.msg);
      setIsFormDirty(false);
    } catch (error) {
      toastError(error, setError);
    }
  };

  const { isDarkMode, toggleMode } = useMode();

  const handleAddWorkSpaceClick = () => {
    const url = `/on-boarding/${userDetails?.email}?name=${userDetails?.name}`;
    navigate(url);
  };

  const { mutateAsync: _changeWorkspaceHandler } = useChangeWorkspace();

  const changeWorkspace = async (id) => {
    try {
      const newWorkspace = _getAllWorkspaces?.workspaces?.find((x) => x.workSpaceId === id);
      const res = await _changeWorkspaceHandler(id);
      toastSuccess(res.msg);
      setUserDetails({
        ...userDetails,
        role: newWorkspace.role,
        lastAccessedWorkspace: id,
        activePlan: newWorkspace.plan,
      });
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...userDetails,
          role: newWorkspace.role,
          lastAccessedWorkspace: id,
          activePlan: newWorkspace.plan,
        }),
      );
      navigate(`/dashboard`);
    } catch (error) {
      toastError(error);
    }
  };

  const onSettingDefaultStorage = async (e) => {
    try {
      const res = await _defaultStorageChangeHandler({ defaultStorage: e.target.value });

      if (res?.msg) {
        toastSuccess(res.msg);
        await refetch();
      }
    } catch (error) {
      toastError(error);
    }
  };

  const resetForm = () => {
    ['name', 'email', 'profilePicture'].forEach((key) => {
      setValue(key, initialUserData?.[key]);
    });
  };

  const handleToggleShowPassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [setShowPassword, showPassword]);

  const handleToggleConfirmPassword = useCallback(() => {
    setConfirmPassword(!confirmPassword);
  }, [setConfirmPassword, confirmPassword]);

  return (
    <MainWrapper title="My Setting" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
      {isLoading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit(addEditUserHandler)}>
          <span className={style.subtitle}>Account settings</span>
          <div className={style.wrapper}>
            <div className={style.leftSection}>
              <p>Profile Picture</p>
              <div className={style.initialContainer}>
                <label className={style.camDiv} htmlFor="file">
                  <>
                    {watch('profilePicture') ? (
                      <img src={watch('profilePicture')} alt="" />
                    ) : (
                      _userDataById?.user?.name
                        ?.split(' ')
                        ?.slice(0, 2)
                        ?.map((word) => word[0]?.toUpperCase())
                        ?.join('')
                    )}
                    <input
                      type="file"
                      id="file"
                      name="image"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        e && setIsFormDirty(true);
                        fileUpload(e, /(\.jpg|\.jpeg|\.png|\.gif)$/i, 'profilePicture');
                      }}
                    />
                  </>
                </label>
              </div>
              <Button
                text={watch('profilePicture') ? 'Remove Profile Picture' : 'Upload Profile Picture'}
                btnClass={style.btnClass}
                handleClick={() => {
                  watch('profilePicture') ? setValue('profilePicture', null) : openFileInput();
                  setIsFormDirty(true);
                }}
                type={'button'}
              />
            </div>
            <div className={style.rightSection}>
              <TextField
                onClickHandle={handleInputChange}
                label={'User Name'}
                name="name"
                register={() => register('name')}
              />
              <TextField
                onClickHandle={handleInputChange}
                label={'Email'}
                name="email"
                register={() => register('email')}
              />
              <div className={style.passwordDiv}>
                <TextField
                  onClickHandle={handleInputChange}
                  label={'New Password'}
                  name={'newPassword'}
                  type={!showPassword && 'password'}
                  register={() => register('newPassword')}
                  placeholder="*******"
                  showToggleButton
                />
                {watch('newPassword') && (
                  <span className={style.hideShowBtn} onClick={handleToggleShowPassword}>
                    {showPassword ? 'hide' : 'show'}
                  </span>
                )}
              </div>
              <div className={style.passwordDiv}>
                <TextField
                  onClickHandle={handleInputChange}
                  label={'Confirm Password'}
                  name={'confirmPassword'}
                  type={!confirmPassword && 'password'}
                  register={() => register('confirmPassword')}
                  placeholder="*******"
                  showToggleButton
                />
                {watch('confirmPassword') && (
                  <span className={style.hideShowBtn} onClick={handleToggleConfirmPassword}>
                    {confirmPassword ? 'hide' : 'show'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className={style.titleMain}>General Settings</span>
          <SelectBox
            options={timeZones}
            label={'Time zone'}
            placeholder={'Select'}
            name={'timeZone'}
            control={control}
            numberBadgeColor={'#39695b'}
            isClearable={false}
            register={() => register('timeZone')}
            dynamicClass={style.zDynamicState4}
            onChange={() => setIsFormDirty(true)}
          />

          <div className={style.toggleDiv}>
            <span>Dark Mode</span>
            <Switch checked={isDarkMode} control={control} name={'switch'} handleSwitchChange={toggleMode} />
          </div>

          <div className={style.integrations}>
            <div className={style.top}>
              <span>Storage</span>
            </div>

            <div className={style.radio}>
              <RadioButtons
                options={[
                  { value: 'S3', label: 'Default' },
                  { value: 'Google Drive', label: 'Google Drive' },
                ]}
                name={'defaultStorage'}
                control={control}
                onChangeHandler={onSettingDefaultStorage}
                isDisabled={_isStorageLoading}
              />
            </div>

            {}
          </div>
          <div className={style.integrations}>
            <div className={style.top1}>
              <span>Integrations</span>
            </div>

            <IntegrationCard
              type="google-drive"
              refetch={refetch}
              connected={_userDataById?.user?.googleDriveAccessToken || _userDataById?.user?.googleDriveRefreshToken}
            />
          </div>

          <div className={style.workspaces}>
            <div className={style.top}>
              <span>My workspaces</span>
              <span onClick={handleAddWorkSpaceClick}>Add New Workspace</span>
            </div>
            <div className={style.bottom}>
              {_getAllWorkspaces?.workspaces
                ?.filter((ele) => ele?.workSpaceId !== userDetails?.lastAccessedWorkspace)
                ?.map((ele) => (
                  <WorkspaceItem key={ele?.name} ele={ele} onChangeWorkspace={changeWorkspace} />
                ))}
            </div>
            <div className={style.delBtnDiv} style={{ bottom: isFormDirty ? '95px' : '50px' }}>
              <Button text={'Delete My Account'} btnClass={style.delBtn} type={'button'} />
            </div>
          </div>

          {isFormDirty && (
            <div className={style.btnDiv}>
              <Button
                text={'Cancel'}
                btnClass={style.cancelBtn}
                type={'button'}
                handleClick={() => {
                  setIsFormDirty(false);
                  resetForm();
                }}
              />
              <Button text={'Save Changes'} btnClass={style.btnClass} disabled={false} type={'submit'} />
            </div>
          )}
        </form>
      )}
    </MainWrapper>
  );
};

export default AccountSetting;

const WorkspaceItem = ({ ele, onChangeWorkspace }) => {
  const handleWorkspaceClick = useCallback(() => {
    onChangeWorkspace(ele?.workSpaceId);
  }, [ele, onChangeWorkspace]);

  return (
    <div key={ele?.name} className={style.workspace} onClick={handleWorkspaceClick} title={ele?.name}>
      <div className={style.avatar}>
        {ele?.avatar ? (
          <img src={ele?.avatar} height={40} width={40} alt="" style={{ borderRadius: '50%' }} />
        ) : (
          <span>{ele?.name?.charAt(0)?.toUpperCase()}</span>
        )}
      </div>
      <span>{ele?.name}</span>
    </div>
  );
};
