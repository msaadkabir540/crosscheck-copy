import { useCallback, useState } from 'react';

import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import DeleteModal from 'components/delete-modal';

import { useToaster } from 'hooks/use-toaster';

import {
  useGetTimeTrackingHistoryById,
  useDeleteTimeEntry,
  useEditTrackedTime,
} from 'api/v1/test-run-time-tracking/time-tracking';

import HistoryRow from './history-row';
import { formatDateTimeForAPI } from '../../../utils/date-handler';
import Icon from '../../icon/themed-icon';
import style from './history-modal.module.scss';

const HistoryModal = ({ openHistoryModal, setOpenHistory, runId }) => {
  const { control, watch, setValue } = useForm();
  const [openDelModal, setOpenDelModal] = useState(false);
  const [edit, setEdit] = useState();
  const { toastError, toastSuccess } = useToaster();
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');

  // NOTE: if no change it will set the prev date after formatting
  const convertPrevTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    return formattedTime;
  };

  const getUnchangedTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return formattedTime;
  };

  const startTimeValue = watch('startTime');
  const startTimeEntryValue = watch('entryDate.startTime');

  const stopTimeValue = watch('stopTime');
  const stopTimeEntryValue = watch('entryDate.stopTime');

  const { data: _timeTrackHistoryData = {}, refetch } = useGetTimeTrackingHistoryById(openHistoryModal && runId);
  const { mutateAsync: _deleteTimeEntryHandler, isLoading: _isLoadingDeleteEntry } = useDeleteTimeEntry();

  const onDelete = useCallback(async () => {
    try {
      const res = await _deleteTimeEntryHandler({
        id: runId,
        body: { timeEntryId: openDelModal?.id },
      });
      toastSuccess(res.msg);
      setOpenDelModal({ open: false });
      refetch();
    } catch (error) {
      toastError(error);
    }
  }, [_deleteTimeEntryHandler, openDelModal?.id, refetch, runId, toastError, toastSuccess]);

  const { mutateAsync: _UpdateTimeHandler } = useEditTrackedTime();

  const editTime = useCallback(
    async (EntryId) => {
      try {
        const formData = {
          timeEntryId: EntryId,
          startTime: watch('startTime')
            ? formatDateTimeForAPI(startTimeValue, startTimeEntryValue)
            : formatDateTimeForAPI(getUnchangedTime(edit?.startTime), startTimeEntryValue) ||
              convertPrevTimestamp(edit?.startTime),
          stopTime: watch('stopTime')
            ? formatDateTimeForAPI(stopTimeValue, stopTimeEntryValue)
            : formatDateTimeForAPI(getUnchangedTime(edit?.stopTime), stopTimeEntryValue) ||
              convertPrevTimestamp(edit?.stopTime),
        };

        const res = await _UpdateTimeHandler({ id: runId, body: formData });
        toastSuccess(res.msg);
        setEdit(null);
        setValue('startTime', '');
        setValue('stopTime', '');
        refetch();
      } catch (error) {
        toastError(error);
      }
    },
    [
      _UpdateTimeHandler,
      edit?.startTime,
      edit?.stopTime,
      refetch,
      runId,
      setValue,
      startTimeEntryValue,
      startTimeValue,
      stopTimeEntryValue,
      stopTimeValue,
      toastError,
      toastSuccess,
      watch,
    ],
  );

  const handleClose = useCallback(() => {
    setOpenHistory(false);
    setEdit(null);
  }, [setOpenHistory, setEdit]);

  const handleCloseDelModal = useCallback(() => {
    setOpenDelModal({ open: false });
  }, [setOpenDelModal]);

  const timeControls = {
    watch,
    control,
    startTime,
    setStartTime,
    stopTime,
    setStopTime,
    setValue,
  };

  return (
    <Modal open={openHistoryModal} handleClose={handleClose} className={style.mainDiv}>
      <div className={style.crossImg}>
        <span className={style.modalTitle}>Time Tracking History</span>
        <div onClick={handleClose} className={style.hover}>
          <Icon name={'CrossIcon'} />
        </div>
      </div>
      <div className={style.mainHistory}>
        {_timeTrackHistoryData &&
          _timeTrackHistoryData?.timeEntries?.map((ele) => (
            <div key={ele?.userId?._id}>
              <div className={style.profileDiv}>
                <div className={style.left}>
                  {ele?.userId?.profilePicture ? (
                    <img src={ele?.userId?.profilePicture} alt="userprofilepicture" height={32} width={32} />
                  ) : (
                    <span className={style.noNameIcon}>
                      {ele?.userId?.name
                        ?.split(' ')
                        ?.slice(0, 2)
                        ?.map((word) => word[0]?.toUpperCase())
                        ?.join('')}
                    </span>
                  )}
                  <span>{ele?.userId?.name}</span>
                </div>
                <span className={style.right}>{ele?.totalDuration}</span>
              </div>
              <div className={style.table}>
                <div className={style.tableHeader}>
                  <span className={style.headerLabel}>Time</span>
                  <span className={style.headerLabel}>Start Time</span>
                  <span className={style.headerLabel}>End Time</span>
                  <span className={style.headerLabel}>Actions</span>
                </div>
                {ele?.entries?.map((entry, index) => (
                  <HistoryRow
                    index={index}
                    key={entry?.timeEntryId}
                    ele={ele}
                    edit={edit}
                    setEdit={setEdit}
                    entry={entry}
                    setOpenDelModal={setOpenDelModal}
                    editTime={editTime}
                    timeControls={timeControls}
                  />
                ))}
              </div>
            </div>
          ))}
        <DeleteModal
          openDelModal={!!openDelModal.open}
          setOpenDelModal={handleCloseDelModal}
          name="Time Entry"
          clickHandler={onDelete}
          cancelText="No, Keep it"
          isLoading={_isLoadingDeleteEntry}
        />
      </div>
    </Modal>
  );
};

export default HistoryModal;
