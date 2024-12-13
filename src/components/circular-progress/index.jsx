import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import style from './time-progress.module.scss';

const CircularProgress = ({ time, maxVal }) => {
  return (
    <>
      <div className={style.main}>
        <CircularProgressbar
          value={time}
          maxValue={maxVal}
          text={`${time}%`}
          styles={{
            path: {
              stroke: '#34C369',
              transition: 'stroke-dashoffset 0.5s ease 0s',
              transformOrigin: 'center center',
              strokeLinecap: 'square',
            },
            trail: {
              stroke: 'rgba(17, 16, 61, 0.14)',
              strokeLinecap: 'round',
              transformOrigin: 'center center',
            },
            text: {
              fill: '#34C369',
              fontSize: '16px',
              fontWeight: 600,
            },
          }}
        />
      </div>
    </>
  );
};

export default CircularProgress;
