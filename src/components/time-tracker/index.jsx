import { useCallback, useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';

import { useAppContext } from 'context/app-context';

import Button from 'components/button';

import { useToaster } from 'hooks/use-toaster';

import {
  useAddManualEntry,
  useStartTime,
  useStopTime,
  useGetTimeTrackingHistoryById,
} from 'api/v1/test-run-time-tracking/time-tracking';
import { useGetUserById } from 'api/v1/settings/user-management';

import { formatDateTimeForAPI, getCurrentTime } from 'utils/date-handler';

import Tabs from '../tabs';
import CustomDateTimePicker from '../custom-date-time-picker';
import HistoryModal from './history-modal';
import Stopwatch from '../stop-watch';
import style from './time-tracker.module.scss';
import Icon from '../icon/themed-icon';

const TimeTracker = ({ runId, handleDrawerClose, startFromReminder, setStartFromReminder }) => {
  const hasCalledRef = useRef(false);
  const { control, watch } = useForm();
  const [active, setActive] = useState(0);
  const { userDetails } = useAppContext();
  const { toastError, toastSuccess } = useToaster();
  const [timerModal, setTimerModal] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);
  const [startStopTime, setStartStopTime] = useState(false);
  const [startStopTicker, setStartStopTicker] = useState(false);
  const [startTime, setStartTime] = useState(getCurrentTime() || '10:00 am');
  const [stopTime, setStopTime] = useState(getCurrentTime() || '10:00 am');

  const { data: _userDataById, refetch } = useGetUserById(userDetails?.id || userDetails?._id);
  const { mutateAsync: _addManualEntryHandler, isLoading: _manualEntryIsLoading } = useAddManualEntry();
  const { mutateAsync: _startTimeHandler, isLoading: _startIsLoading } = useStartTime();
  const { mutateAsync: _stopTimeHandler, isLoading: _stopIsLoading } = useStopTime();

  useEffect(() => {
    if (_userDataById?.user?.timerStartTime && runId === _userDataById?.user?.timerRunId?._id) {
      setStartStopTime(true);
    }
  }, [_userDataById?.user?.timerStartTime, _userDataById?.user?.timerRunId?._id, runId]);

  const startTimeManual = formatDateTimeForAPI(startTime, watch('startTime.entryDate'));
  const stopTimeManual = formatDateTimeForAPI(stopTime, watch('stopTime.entryDate'));
  const { data: _timeTrackHistoryData = {}, refetch: refetchTimeHistory } = useGetTimeTrackingHistoryById(runId);

  const handleViewHistoryClick = useCallback(() => {
    setViewHistory(true);
    handleDrawerClose();
  }, [setViewHistory, handleDrawerClose]);

  const onSubmit = useCallback(async () => {
    try {
      const formData = {
        startTime: startTimeManual,
        stopTime: stopTimeManual,
      };
      const res = await _addManualEntryHandler({ id: runId, body: formData });
      toastSuccess(res.msg);
      setTimerModal(false);
    } catch (error) {
      toastError(error);
    }
  }, [_addManualEntryHandler, runId, startTimeManual, stopTimeManual, toastError, toastSuccess]);

  const handleTimeFunc = useCallback(
    async (isStartTime) => {
      try {
        const currentDateTime = new Date();
        const hours = currentDateTime?.getHours();
        const minutes = currentDateTime?.getMinutes();

        const formattedTime = `${currentDateTime?.toISOString().split('T')[0]}T${hours}:${minutes
          ?.toString()
          ?.padStart(2, '0')}:00`;

        const formData = isStartTime ? { startTime: formattedTime } : { stopTime: formattedTime };

        const handler = isStartTime ? _startTimeHandler : _stopTimeHandler;
        const res = await handler({ id: runId, body: formData });
        setStartStopTime(isStartTime);
        setStartFromReminder(false);
        toastSuccess(res.msg);
        refetch();
        refetchTimeHistory();
      } catch (error) {
        toastError(error);
      }
    },
    [
      _startTimeHandler,
      _stopTimeHandler,
      refetch,
      refetchTimeHistory,
      runId,
      setStartFromReminder,
      toastError,
      toastSuccess,
    ],
  );

  useEffect(() => {
    if (startFromReminder && !hasCalledRef.current) {
      hasCalledRef.current = true;
      handleTimeFunc(true).finally(() => {
        hasCalledRef.current = false;
      });
    }
  }, [startFromReminder, handleTimeFunc]);

  const toggleTimerModal = useCallback(() => {
    setTimerModal((prevTimerModal) => !prevTimerModal);
  }, [setTimerModal]);

  const handleStopTimerClick = useCallback(
    (e) => {
      e.stopPropagation();

      if (!_startIsLoading && !_stopIsLoading) {
        handleTimeFunc(false);
        setStartStopTicker(false);
      }
    },
    [_startIsLoading, _stopIsLoading, handleTimeFunc, setStartStopTicker],
  );

  const handleStartTimerClick = useCallback(
    (e) => {
      e.stopPropagation();

      if (!_startIsLoading && !_stopIsLoading) {
        handleTimeFunc(true);
        setStartStopTicker(true);
      }
    },
    [_startIsLoading, _stopIsLoading, handleTimeFunc, setStartStopTicker],
  );

  const tabs = [
    {
      tabTitle: 'Track Time',
      content: (
        <div className={style.timerMenu}>
          {startStopTime && runId === _userDataById?.user?.timerRunId?._id ? (
            <div onClick={handleStopTimerClick}>
              <Icon name={'StopTimer'} height={80} width={80} />
            </div>
          ) : (
            <div onClick={handleStartTimerClick}>
              <Icon name={'StartTimer'} height={80} width={80} />
            </div>
          )}

          <span className={style.timeText}>
            {startStopTime && _userDataById?.user?.timerStartTime ? (
              <Stopwatch
                startStopTicker={startStopTicker}
                setStartStopTicker={setStartStopTicker}
                isRunning={_userDataById?.user?.timerRunId}
                startedAt={_userDataById?.user?.timerStartTime}
              />
            ) : (
              '00:00:00'
            )}
          </span>
          <div className={style.menuHistoryDiv}>
            <span onClick={handleViewHistoryClick}>View History</span>
          </div>
        </div>
      ),
    },
    {
      tabTitle: 'Manual Entry',
      content: (
        <div className={style.manualMenu}>
          <div className={style.dateDiv}>
            <CustomDateTimePicker
              watch={watch}
              control={control}
              required
              label={'Start'}
              name={'startTime'}
              time={startTime}
              setTime={setStartTime}
              datePopperSide={'left'}
            />
          </div>
          <div className={style.dateDiv2}>
            <CustomDateTimePicker
              watch={watch}
              control={control}
              required
              name={'stopTime'}
              label={'End'}
              time={stopTime}
              setTime={setStopTime}
              datePopperSide={'left'}
            />
          </div>
          <div className={style.menuHistoryDiv}>
            <span className={style.span} onClick={handleViewHistoryClick}>
              View History
            </span>
            <Button
              text={'Discard'}
              type={'button'}
              btnClass={style.btnClassUncheckModal}
              handleClick={toggleTimerModal}
            />
            <Button text={`Save`} type={'button'} handleClick={onSubmit} disabled={_manualEntryIsLoading} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={style.main}>
        <div className={style.left} onClick={toggleTimerModal}>
          {startStopTime && runId === _userDataById?.user?.timerRunId?._id ? (
            <div onClick={handleStopTimerClick} className={style.startStopIconDiv}>
              <Icon name={'StopTimer'} height={24} width={24} />
            </div>
          ) : (
            <div onClick={handleStartTimerClick} className={style.startStopIconDiv}>
              <Icon name={'StartTimer'} height={24} width={24} />
            </div>
          )}

          <p className={style.trackText}>
            {startStopTime && _userDataById?.user?.timerStartTime ? (
              <Stopwatch
                startStopTicker={startStopTicker}
                setStartStopTicker={setStartStopTicker}
                isRunning={_userDataById?.user?.timerRunId}
                startedAt={_userDataById?.user?.timerStartTime}
              />
            ) : _timeTrackHistoryData ? (
              _timeTrackHistoryData?.overallDuration
            ) : (
              'Track Time'
            )}
          </p>
        </div>
        <p className={style.historyText} onClick={handleViewHistoryClick}>
          View Time History
        </p>
        {timerModal && (
          <div className={style.timerModal}>
            <Tabs pages={tabs} activeTab={active} setActiveTab={setActive} />
          </div>
        )}
      </div>
      {timerModal && <div className={style.backdropDiv} onClick={toggleTimerModal}></div>}
      <HistoryModal runId={runId} openHistoryModal={viewHistory} setOpenHistory={setViewHistory} />
    </>
  );
};

export default TimeTracker;
