import { useCallback, useMemo, useState } from 'react';

import { Controller } from 'react-hook-form';
import TimeKeeper from 'react-timekeeper';

import DatePicker from 'components/date-picker';

import { formattedDate } from 'utils/date-handler';

import style from './date-time-picker.module.scss';
import Icon from '../icon/themed-icon';

const DateTimePicker = ({
  time,
  required,
  setValue = () => {},
  watch,
  editMode,
  datePopperSide,
  prefillData,
  name,
  control,
  showChangedTime,
  setTime,
  label,
}) => {
  const [showTime, setShowTime] = useState(false);
  const prefilledDate = useMemo(() => (prefillData ? new Date(prefillData) : new Date()), [prefillData]);

  const getRelativeLabel = (dueDate) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const formattedDueDate = new Date(dueDate);
    const formattedToday = new Date(today.toDateString());
    const formattedTomorrow = new Date(tomorrow.toDateString());
    const diffInDays = Math.floor((formattedDueDate - formattedToday) / (24 * 60 * 60 * 1000));

    switch (true) {
      case formattedDueDate.getTime() === formattedToday.getTime():
        return 'Now';
      case formattedDueDate.getTime() === formattedTomorrow.getTime() || diffInDays === 1:
        return 'Tomorrow';

      case diffInDays > 1 && diffInDays <= 6: {
        const options = { weekday: 'long' };

        return new Intl.DateTimeFormat('en-US', options).format(formattedDueDate);
      }

      case diffInDays === -1:
        return 'Yesterday';
      case diffInDays === -2:
        return formattedDate(dueDate, 'dd/MMM/yy');
      default:
        return formattedDate(dueDate, 'dd MMM');
    }
  };

  const handleShowTimeClose = useCallback(() => setShowTime(false), []);
  const handleStopPropogation = useCallback((e) => e.stopPropagation(), []);
  const handleMainClick = useCallback(() => setShowTime(!showTime), [showTime]);

  const renderDoneButton = useCallback(
    () => (
      <div className={style.doneDiv} onClick={handleShowTimeClose}>
        <span className={style.done}> Done</span>
        <div className={style.dateDiv} onClick={handleStopPropogation}>
          <span className={style.when}>
            when:{' '}
            <span className={style.day}>
              {watch(`entryDate.${name}`) && getRelativeLabel(watch(`entryDate.${name}`))}
            </span>
          </span>
          <div className={style.dateWrapper}>
            <DatePicker
              control={control}
              name={`entryDate.${name}`}
              placeholder={'Select'}
              className={style.customDateStyle}
              popperPlacement={datePopperSide}
              maxDate={new Date()}
            />
          </div>
        </div>
      </div>
    ),
    [handleShowTimeClose, handleStopPropogation, datePopperSide, watch, control, name],
  );

  const handleOnChange = useCallback(
    (newTime) => {
      setTime(newTime?.formatted12);
      editMode && setValue(name, newTime?.formatted12);
    },
    [setValue, setTime, editMode, name],
  );

  const timeDate = useMemo(() => {
    return formattedDate(watch(`entryDate.${name}`) || prefilledDate, 'dd MMM, yyyy');
  }, [name, prefilledDate, watch]);

  const handleRender = useCallback(
    () => (
      <>
        {label && (
          <label className={style.label}>
            {label}
            {required && <div />}
          </label>
        )}
        <div className={style.main} onClick={handleMainClick}>
          <div className={style.valueDiv}>
            <span className={style.timeText}>{showChangedTime || time}</span>
            <span className={style.dateText}>{timeDate}</span>
          </div>
          <Icon name={'TimeDatePicker'} />
          {showTime && (
            <div className={style.timeKeeper} onClick={handleStopPropogation}>
              <TimeKeeper
                time={time}
                onChange={handleOnChange}
                onDoneClick={handleShowTimeClose}
                switchToMinuteOnHourSelect
                doneButton={renderDoneButton}
              />
            </div>
          )}
        </div>
        {showTime && <div className={style.backdropDiv} onClick={handleShowTimeClose}></div>}
      </>
    ),
    [
      time,
      label,
      showTime,
      required,
      timeDate,
      handleOnChange,
      showChangedTime,
      handleMainClick,
      renderDoneButton,
      handleShowTimeClose,
      handleStopPropogation,
    ],
  );

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={{ time: time, entryDate: prefilledDate }}
      render={handleRender}
    />
  );
};

export default DateTimePicker;
