import React, { useRef, useState } from 'react';

import { useForm } from 'react-hook-form';
import _ from 'lodash';

import { useAppContext } from 'context/app-context';

import MainWrapper from 'components/layout/main-wrapper';
import TextField from 'components/text-field';
import Button from 'components/button';
import { RadioButtons } from 'components/form-fields';
import Loader from 'components/loader';

import { useToaster } from 'hooks/use-toaster';

import { useDeleteWorkspace, useGetMyWorkspaces, useUpdateWorkspace } from 'api/v1/settings/user-management';

import { handleFile } from 'utils/file-handler';
import { formattedDate } from 'utils/date-handler';

import style from './account-settings.module.scss';
import DeleteModal from './delete-modal';
import Icon from '../../components/icon/themed-icon';
import StorageBar from '../../components/storage-bar';

const WorkspaceSetting = () => {
  const { setError, register, control, setValue, watch, handleSubmit, reset, formState } = useForm();
  const { mutateAsync: _updateWorkspaceHandler, isLoading } = useUpdateWorkspace();
  const { userDetails } = useAppContext();
  const { toastSuccess, toastError } = useToaster();
  const fileInputRef = useRef(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [delModal, setDelModal] = useState(false);
  const isDirty = formState?.isDirty;

  const openFileInput = () => {
    fileInputRef?.current?.click();
  };

  const fileUpload = async (event, allowedType, name) => {
    const base64 = await handleFile(event, allowedType);
    setValue(name, base64);
  };

  const signUpMode = userDetails?.signUpType;

  const { data: _getAllWorkspaces, isLoading: workspacesLoading, refetch } = useGetMyWorkspaces(signUpMode);
  const { mutateAsync: _deleteWorkspaceHandler } = useDeleteWorkspace();

  const matchingWorkspace =
    _getAllWorkspaces?.workspaces?.length > 0 &&
    _getAllWorkspaces?.workspaces?.find((workspaces) => workspaces?.workSpaceId === userDetails?.lastAccessedWorkspace);

  React.useEffect(() => {
    if (matchingWorkspace && Object.keys(matchingWorkspace).length) {
      let values = _.pick(matchingWorkspace, ['name', 'avatar', 'defaultStorage']);
      values = {
        ...values,
      };
      Object.entries(values).forEach(([key, val]) => {
        setValue(key, val);
      });
    }
  }, []);

  const editWorkspaceHandler = async (data) => {
    const formData = {
      name: data.name,
      defaultStorage: data?.defaultStorage,
    };

    if (watch('avatar')) {
      formData.avatar = data.avatar;
    }

    try {
      const res = await _updateWorkspaceHandler({
        body: formData,
      });

      toastSuccess(res.msg);
      setIsFormDirty(false);
      refetch();
    } catch (error) {
      toastError(error, setError);
    }
  };

  const handleWorkspaceDelete = async () => {
    const formData = {
      name: matchingWorkspace?.name,
    };

    try {
      const res = await _deleteWorkspaceHandler({
        body: formData,
      });
      toastSuccess(res?.msg);
    } catch (error) {
      toastError(error);
    }

    setDelModal(false);
  };

  return (
    <MainWrapper title="Workspace Setting" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
      {workspacesLoading ? (
        <Loader />
      ) : (
        <>
          <form onSubmit={handleSubmit(editWorkspaceHandler)} className={style.formWrapper}>
            <div className={style.wrapper}>
              <div className={style.leftSection}>
                <p>Workspace Avatar</p>
                <div className={style.initialContainer}>
                  <label className={style.camDiv} htmlFor="file">
                    <>
                      {matchingWorkspace && watch('avatar') ? (
                        <img src={watch('avatar')} alt="ws-avatar" />
                      ) : (
                        matchingWorkspace?.name
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
                          fileUpload(e, /(\.jpg|\.jpeg|\.png|\.gif)$/i, 'avatar');
                        }}
                      />
                    </>
                  </label>
                </div>
                <Button
                  text={watch('avatar') ? 'Remove Avatar' : 'Upload Avatar'}
                  btnClass={style.btnClass}
                  handleClick={() => {
                    watch('avatar') ? setValue('avatar', null) : openFileInput();
                    setIsFormDirty(true);
                  }}
                  type={'button'}
                />
              </div>
              <div className={style.rightSection}>
                <TextField label={'Workspace Name'} name="name" register={() => register('name')} />

                <RadioButtons
                  options={defaultStorageOpt}
                  name={'defaultStorage'}
                  label={'Storage'}
                  control={control}
                  className={style.radioBtns}
                />
                {userDetails?.superAdmin && (
                  <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button
                      text={'Delete Workspace'}
                      btnClass={style.delBtn}
                      type={'button'}
                      handleClick={() => {
                        setDelModal(true);
                      }}
                    />
                  </div>
                )}
                {(isDirty || isFormDirty) && (
                  <div className={style.btnDiv}>
                    <Button
                      text={'Cancel'}
                      btnClass={style.cancelBtn}
                      type={'button'}
                      handleClick={() => {
                        reset();
                        setIsFormDirty(false);
                      }}
                    />
                    <Button text={'Save Changes'} btnClass={style.btnClass} disabled={isLoading} type={'submit'} />
                  </div>
                )}
              </div>
            </div>
            <div className={style.storageCard}>
              <div className={style.icon}>
                <Icon name={'CloudStorage'} height={60} width={60} />
              </div>
              <h1>Workspace Storage</h1>
              <span>Supervise your workspace’ storage in the easiest way</span>
              <p>This storage is provided by Crosscheck</p>
              <div className={style.progress}>
                <StorageBar
                  totalStorageInGb={matchingWorkspace?.s3totalStorageInGb}
                  usedStorage={matchingWorkspace?.s3usedStorage}
                />
              </div>
            </div>
            <DeleteModal
              openDelModal={!!delModal}
              setOpenDelModal={() => setDelModal(false)}
              title={'Are you sure you want to delete this workspace?'}
              subtitle={'This action cannot be undone and all the data will be deleted forever'}
              removeText={'Delete'}
              cancelText={'Cancel'}
              workspaceName={matchingWorkspace?.name}
              handleUserDelete={handleWorkspaceDelete}
            />
          </form>
        </>
      )}
    </MainWrapper>
  );
};

export default WorkspaceSetting;

const defaultStorageOpt = [
  { label: 'Default', value: 'S3' },
  { label: 'One Drive', value: 'One Drive' },
  { label: 'Google Drive', value: 'Google Drive' },
];
