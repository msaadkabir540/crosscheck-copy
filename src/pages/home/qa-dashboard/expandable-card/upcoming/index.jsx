import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import MultiColorProgressBar from 'components/progress-bar';

import style from './upcoming.module.scss';

const Upcoming = ({ id, testedCount, testCases, notTestedCount, title, subTitle, date }) => {
  const navigate = useNavigate();

  const navigateToTestRun = useCallback(() => {
    navigate(`/test-run/${id}`);
  }, [id]);

  return (
    <div className={style.wrapper} style={{ cursor: 'pointer' }} onClick={navigateToTestRun}>
      <div className={style.inner}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <p className={style.title}>{title}</p>
          <p className={style.dateScss}>{date && `Due Date: ${date}`}</p>
        </div>
        <p className={style.subTitle}>{subTitle}</p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: '10px',
          }}
        >
          <MultiColorProgressBar
            readings={[
              testedCount && {
                name: 'testedCount',
                value: (testedCount / testCases?.length) * 100,
                color: '#34C369',
              },
              notTestedCount && {
                name: 'notTestedCount',
                value: (notTestedCount / testCases?.length) * 100,
                color: '#D6D6D6',
              },
            ]}
            className={style.progressBar}
          />
          <p className={style.dateScss}>{`(${testedCount}/${testCases?.length})`}</p>
        </div>
      </div>
    </div>
  );
};

export default Upcoming;
