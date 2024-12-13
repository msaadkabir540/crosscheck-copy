import { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Stopwatch from 'components/stop-watch';

import { useToaster } from 'hooks/use-toaster';

import { useStopTime } from 'api/v1/test-run-time-tracking/time-tracking';

import style from './floating-timer.module.scss';
import Icon from '../icon/themed-icon';

const FLoatingTimer = ({ userById, refetch }) => {
  const [minimize, setMinimize] = useState(false);
  const { toastError, toastSuccess } = useToaster();

  const handleToggleMinimize = useCallback(() => {
    setMinimize(!minimize);
  }, [minimize]);

  const navigate = useNavigate();

  const { mutateAsync: _stopTimeHandler } = useStopTime();

  const handleTimeFunc = useCallback(async () => {
    try {
      const currentDateTime = new Date();
      const hours = currentDateTime?.getHours();
      const minutes = currentDateTime?.getMinutes();

      const formattedTime = `${currentDateTime?.toISOString().split('T')[0]}T${hours}:${minutes
        ?.toString()
        ?.padStart(2, '0')}:00`;

      const formData = { stopTime: formattedTime };

      const handler = _stopTimeHandler;
      const res = await handler({ id: userById?.user?.timerRunId?._id, body: formData });
      toastSuccess(res.msg);
      refetch();
    } catch (error) {
      toastError(error);
    }
  }, [_stopTimeHandler, userById?.user?.timerRunId?._id, toastSuccess, refetch, toastError]);

  const handleNavigate = useCallback(
    () => navigate(`/test-run/${userById?.user?.timerRunId?._id}`),
    [navigate, userById?.user?.timerRunId?._id],
  );

  return (
    <div className={`${minimize ? style.minimizedContainer : style.expandedContainer}`}>
      <div className={`${style.minimize} ${minimize ? style.blinking : ''}`} onClick={handleToggleMinimize} />
      {!minimize && (
        <>
          <div onClick={handleTimeFunc}>
            <Icon name={'StopTimer'} height={24} width={24} />
          </div>
          <div className={style.time}>
            {<Stopwatch isRunning={userById?.user?.timerRunId} startedAt={userById?.user?.timerStartTime} />}
          </div>
          <span className={style.runId} onClick={handleNavigate}>
            {userById?.user?.timerRunId?.runId}
          </span>
        </>
      )}
    </div>
  );
};

export default FLoatingTimer;
