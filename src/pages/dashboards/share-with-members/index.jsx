import { useMemo, useState } from 'react';

import { useForm } from 'react-hook-form';

import { useAppContext } from 'context/app-context';

import SelectBox from 'components/select-box';
import Button from 'components/button';
import Modal from 'components/modal';
import FormCloseModal from 'components/form-close-modal';
import Row from 'components/members-row';

import { useToaster } from 'hooks/use-toaster';

import {
  useGetCustomDashboardsById,
  useUpdateDashboardShareWith,
  useRemoveDashboardShareWithMember,
} from 'api/v1/custom-dashboard/custom-dashboard';

import { useUsersOptions } from 'utils/drop-down-options';

import style from './style.module.scss';
import Icon from '../../../components/icon/themed-icon';

const Index = ({ open, setOpen, backClass, refetch, editRecordId, setEditRecord }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setError,
  } = useForm();
  const { toastSuccess, toastError } = useToaster();
  const { userDetails } = useAppContext();

  const [isDiscardOpen, setIsDiscardOpen] = useState(false);

  const { data: _usersOptions } = useUsersOptions();

  const {
    data: _dashboardData,

    refetch: refetchSingle,
  } = useGetCustomDashboardsById(editRecordId);
  const { mutateAsync: _updateShareWithHandler, isLoading: isUpdateLoading } = useUpdateDashboardShareWith();
  const { mutateAsync: _removeMember } = useRemoveDashboardShareWithMember();

  const shareWith = useMemo(() => {
    return _dashboardData?.dashboard?.shareWith;
  }, [_dashboardData]);

  const ShareWithOptions = useMemo(() => {
    return (
      _usersOptions?.usersOptions?.filter((x) => {
        return !shareWith?.some((profile) => profile._id === x.value);
      }) || []
    );
  }, [_usersOptions, shareWith]);

  const handleDiscard = () => {
    if (isDirty) {
      setIsDiscardOpen(true);
    } else {
      handleCloseForm();
    }
  };

  const handleCloseForm = () => {
    reset();
    setEditRecord && setEditRecord('');
    setOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      const body = { ...data };
      const res = await _updateShareWithHandler({ id: editRecordId, body });

      if (res?.msg) {
        toastSuccess(res.msg);
        refetch && refetch();
        refetchSingle && refetchSingle();
        handleCloseForm();
      }
    } catch (error) {
      console.error(error);
      toastError(error, setError);
    }
  };

  const onRemove = async (id) => {
    try {
      const body = { memberToRemove: id };
      const res = await _removeMember({ id: editRecordId, body });

      if (res?.msg) {
        toastSuccess(res.msg);
        refetch && refetch();
        refetchSingle && refetchSingle();
      }
    } catch (error) {
      console.error(error);
      toastError(error, setError);
    }
  };

  return (
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
        <span className={style.modalTitle}>Share Dashboard</span>
        <div className={style.hover}>
          <div onClick={handleDiscard} data-cy="close-bugreporting-modal">
            <Icon name={'CrossIcon'} />
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`${style.dataDetails}`}>
          <div className={style.contentLast}>
            <div className={style.contentLast}>
              <div className={style.selectDiv}>
                <SelectBox
                  dynamicWrapper={style.noLabel}
                  name="shareWith"
                  control={control}
                  rules={{
                    required: 'Required',
                  }}
                  badge
                  options={ShareWithOptions}
                  isMulti
                  placeholder={'Select'}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  errorMessage={errors.shareWith && errors.shareWith.message}
                />

                <Button text={'Share'} type={'submit'} disabled={isUpdateLoading} />
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className={`${style.dataDetails} ${style.lastDataDetails}`}>
        <div className={style.headingsDiv}>Shared With</div>

        <div className={style.rowContainer}>
          {shareWith?.map((profile) => (
            <Row
              key={profile._id}
              role={userDetails?.role}
              data={{ ...profile, notRemove: profile._id === _dashboardData?.dashboard?.createdBy?._id }}
              handleClick={() => onRemove(profile?._id)}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default Index;
