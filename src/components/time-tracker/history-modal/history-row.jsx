import { useCallback } from 'react';

import CustomDateTimePicker from 'components/custom-date-time-picker';

import { formattedTimeDate } from 'utils/date-handler';

import Icon from '../../icon/themed-icon';
import style from './history-modal.module.scss';

const HistoryRow = ({ entry, edit, ele, index, key, editTime, setOpenDelModal, timeControls, setEdit }) => {
  const { watch, control, startTime, setStartTime, stopTime, setStopTime, setValue } = timeControls;

  // NOTE: converts prev time to 10:00 AM format
  const formatTimeToPrefill = (dateString) => {
    const logDate = new Date(dateString);

    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })?.format(logDate);
  };

  const handleCancelEdit = useCallback(() => {
    setEdit(null);
  }, [setEdit]);

  const handleSetEdit = useCallback(() => {
    setEdit(ele.entries[index]);
  }, [ele?.entries, index, setEdit]);

  const handleEditTime = useCallback(() => {
    editTime(edit.timeEntryId);
  }, [edit?.timeEntryId, editTime]);

  const handleOpenDeleteModal = useCallback(() => {
    setOpenDelModal({
      open: true,
      id: ele?.entries[index]?.timeEntryId,
    });
  }, [ele?.entries, index, setOpenDelModal]);

  return (
    <div className={style.tableRow} key={key}>
      <span className={style.rowText}>{entry?.duration}</span>
      <div className={style.rowTimePicker}>
        {edit === ele?.entries[index] ? (
          <CustomDateTimePicker
            watch={watch}
            control={control}
            time={formatTimeToPrefill(entry?.startTime)}
            prefillData={entry?.startTime}
            name={'startTime'}
            setTime={setStartTime}
            datePopperSide={'auto'}
            showChangedTime={startTime}
            setValue={setValue}
            editMode
          />
        ) : (
          formattedTimeDate(entry?.startTime)
        )}
      </div>
      <div className={style.rowTimePicker}>
        {edit === ele?.entries[index] ? (
          <CustomDateTimePicker
            watch={watch}
            control={control}
            time={formatTimeToPrefill(entry?.stopTime)}
            prefillData={entry?.stopTime}
            name={'stopTime'}
            setTime={setStopTime}
            datePopperSide={'auto'}
            showChangedTime={stopTime}
            setValue={setValue}
            editMode
          />
        ) : (
          formattedTimeDate(entry?.stopTime)
        )}
      </div>
      <div className={style.actions}>
        {edit === ele?.entries[index] ? (
          <div onClick={handleCancelEdit}>
            <Icon name={'CrossIcon'} />
          </div>
        ) : (
          <div onClick={handleSetEdit}>
            <Icon name={'EditIconGrey'} />
          </div>
        )}
        {edit === ele?.entries[index] ? (
          <div onClick={handleEditTime}>
            <Icon name={'TickIcon'} />
          </div>
        ) : (
          <div onClick={handleOpenDeleteModal}>
            <Icon name={'DelIcon'} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryRow;
