import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';

import { useAppContext } from 'context/app-context';

import Modal from 'components/modal';
import TextField from 'components/text-field';
import SelectBox from 'components/select-box';
import Button from 'components/button';
import FormCloseModal from 'components/form-close-modal';
import Loader from 'components/loader';
import Icon from 'components/icon/themed-icon';

import { useToaster } from 'hooks/use-toaster';

import {
  useCreateDashboard,
  useGetCustomDashboardsById,
  useUpdateDashboardName,
} from 'api/v1/custom-dashboard/custom-dashboard';

import { useUsersOptions } from 'utils/drop-down-options';

import style from './style.module.scss';

const Index = ({ open, setOpen, backClass, refetch, isEditable, editRecordId, setEditRecord }) => {
  const {
    control,
    register,
    formState: { errors, isDirty },
    setValue,
    handleSubmit,
    setError,
    reset,
  } = useForm();

  const { data: _usersOptions } = useUsersOptions();
  const { toastSuccess, toastError } = useToaster();
  const { userDetails } = useAppContext();

  const [isDiscardOpen, setIsDiscardOpen] = useState(false);

  const { mutateAsync: _createDashboardHandler, isLoading: _isCreateDashboardLoading } = useCreateDashboard();
  const { mutateAsync: _UpdateNameHandler, isLoading: _isNameUpdating } = useUpdateDashboardName();

  const { data: _dashboardDetails, isFetching } = useGetCustomDashboardsById(editRecordId);

  useEffect(() => {
    if (_dashboardDetails?.dashboard && _dashboardDetails?.dashboard?.dashboardName) {
      setValue('dashboardName', _dashboardDetails?.dashboard?.dashboardName);
    }
  }, [_dashboardDetails, setValue]);

  const handleCloseForm = useCallback(() => {
    reset();
    setEditRecord && setEditRecord('');
    setOpen(false);
  }, [setOpen, setEditRecord, reset]);

  const handleDiscard = useCallback(() => {
    if (isDirty) {
      setIsDiscardOpen(true);
    } else {
      handleCloseForm();
    }
  }, [setIsDiscardOpen, handleCloseForm, isDirty]);

  const onSubmit = async (data) => {
    try {
      const body = { ...data, shareWith: [...(data?.shareWith || []), userDetails?.id] };

      const res = isEditable
        ? await _UpdateNameHandler({ id: editRecordId, body })
        : await _createDashboardHandler({ body });

      if (res?.msg) {
        toastSuccess(res.msg);
        refetch && refetch();
        handleCloseForm();
      }
    } catch (error) {
      console.error(error);
      toastError(error, setError);
    }
  };

  const handleRegisterDashboardName = useCallback(() => {
    return register('dashboardName', { required: 'Required' });
  }, [register]);

  const handleDiscardAction = useCallback(
    (e) => {
      e.preventDefault();
      handleDiscard();
    },
    [handleDiscard],
  );

  return (
    <>
      <Modal open={open} handleClose={handleDiscard} className={`${style.mainDiv} `} backClass={backClass} noBackground>
        {isDiscardOpen && (
          <FormCloseModal
            modelOpen={isDiscardOpen}
            setModelOpen={setIsDiscardOpen}
            confirmBtnHandler={handleCloseForm}
            heading={`You have unsaved changes`}
            subHeading={` Are you sure you want to exit? Your unsaved changes will be discarded.`}
            confirmBtnText={`Discard Changes`}
            icon={<Icon name={'WarningRedIcon'} height={80} width={80} />}
            cancelBtnText={`Back To Form`}
            noBackground
          />
        )}
        <div className={style.crossImg}>
          <span className={style.modalTitle}>{isEditable ? 'Rename Dashboard' : ' Create Dashboard'}</span>
          <div className={style.hover}>
            <div onClick={handleDiscard} data-cy="close-bugreporting-modal">
              <Icon name={'CrossIcon'} />
            </div>
          </div>
        </div>
        {isFetching ? (
          <Loader tableMode />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={style.text_field_container}>
              <TextField
                register={handleRegisterDashboardName}
                errorMessage={errors?.dashboardName?.message}
                name={'dashboardName'}
                placeholder="Enter Dashboard Name"
                label="Dashboard Name"
              />
            </div>
            {!isEditable && (
              <div>
                <SelectBox
                  options={_usersOptions?.usersOptions?.filter((x) => {
                    return x.value !== userDetails?.id;
                  })}
                  label={'Share With'}
                  name={'shareWith'}
                  placeholder="Select"
                  errorMessage={errors?.shareWith?.message}
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  isMulti
                />
              </div>
            )}
            <div className={style.btnDiv}>
              <Button text="Discard" type={'button'} btnClass={style.btn} handleClick={handleDiscardAction} />
              <Button text="Save" type={'submit'} disabled={_isCreateDashboardLoading || _isNameUpdating} />
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default Index;
