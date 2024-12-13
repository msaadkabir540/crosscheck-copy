import { useState, useEffect } from 'react';

const Stopwatch = ({ startStopTicker, isRunning, startedAt, setStartStopTicker }) => {
  const [startTime, setStartTime] = useState(null);
  const [running, setRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const startedAtTimeStamp = new Date(startedAt).getTime();
  const atTheMoment = new Date().getTime();
  const elapsedTimeStamp = atTheMoment - startedAtTimeStamp;

  useEffect(() => {
    const storedStartTime = localStorage.getItem('startTime');
    const storedRunning = localStorage.getItem('running') === 'true';
    const storedElapsedTime = parseInt(localStorage.getItem('elapsedTime'), 10);

    if ((storedStartTime && storedRunning) || (isRunning && startedAtTimeStamp)) {
      setStartTime(parseInt(storedStartTime, 10) || startedAtTimeStamp);
      setRunning(storedRunning || isRunning);
      setElapsedTime(storedElapsedTime || elapsedTimeStamp);
    }

    if (startStopTicker && !running) {
      startStop();
      setStartStopTicker(false);
    }
  }, [startStopTicker, running, setStartStopTicker, isRunning, startedAtTimeStamp, elapsedTimeStamp]);

  useEffect(() => {
    if (running && startTime) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        setElapsedTime(now - startTime);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [running, startTime]);

  const startStop = () => {
    if (!running) {
      const now = new Date().getTime();
      setStartTime(now);
      localStorage.setItem('startTime', now);
    } else {
      const now = new Date().getTime();
      const elapsed = now - startTime + elapsedTime;
      localStorage.setItem('elapsedTime', elapsed);
    }

    localStorage.setItem('running', !running);
    setRunning(!running);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '00:00:00';

    const hours = Math.floor(time / (1000 * 60 * 60))
      .toString()
      .padStart(2, '0');

    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
      .toString()
      .padStart(2, '0');

    const seconds = Math.floor((time % (1000 * 60)) / 1000)
      .toString()
      .padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div>
      <div>{formatTime(running ? elapsedTime : 0)}</div>
    </div>
  );
};

export default Stopwatch;
