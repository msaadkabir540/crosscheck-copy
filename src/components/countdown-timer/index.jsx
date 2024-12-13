import React, { useState, useEffect, useRef } from 'react';

import { formatCountdown } from './helper';

const CountdownTimer = ({ initialSeconds, onExpire }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((prevSecondsLeft) => {
        if (prevSecondsLeft <= 1) {
          clearInterval(timerRef.current);
          if (onExpire) onExpire();

          return 0;
        }

        return prevSecondsLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [onExpire]);

  return <span>{formatCountdown(secondsLeft)}</span>;
};

export default React.memo(CountdownTimer);
