import { useCallback, useState } from 'react';

import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

import Tags from 'components/tags';

import { formattedDate } from 'utils/date-handler';

import style from './upcoming.module.scss';

const Upcoming = ({ reportedBy, lastTestedBy, title, subTitle, date, tagText, img }) => {
  const navigate = useNavigate();
  const [setIsHoveringName] = useState(false);

  let hoverTimeout;

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);

    hoverTimeout = setTimeout(() => {
      setIsHoveringName(true);
    }, 1500);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setIsHoveringName(false);
  };

  const handleNavigateToQaTesting = useCallback(() => {
    navigate(`/qa-testing?bugId=${title}`)
  }, [title])

  return (
    <div className={style.wrapper} style={{ cursor: 'pointer' }}>
      <div
        style={{
          background: 'var(--bg-g)',
          height: '100%',
          width: '3%',
          borderRadius: ' 3px 0px 0px 3px',
        }}
      />
      <div className={style.inner}>
        <p className={style.title} onClick={handleNavigateToQaTesting}>
          {title}{' '}
          <Tags
            text={tagText ? tagText : '-'}
            colorScheme={{
              Low: 'var(--blue)',
              High: 'var(--light-red)',
              Medium: 'var(--orange)',
              Critical: 'var(--light-red)',
            }}
          />
        </p>
        <p className={style.subTitle}>{subTitle}</p>
        <div className={style.imgSection}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>{reportedBy ? 'Reported by:' : lastTestedBy ? 'Last Tested By:' : ''} </span>
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ display: 'flex', position: 'relative', alignItems: 'center', gap: '5px' }}
            >
              {img ? (
                <img alt="img-icon" src={img} style={{ width: '24px', height: '24px', borderRadius: '80%' }} />
              ) : (
                <div
                  style={{
                    borderRadius: '80%',
                    background: 'var(--bg-g)',
                    width: '24px',
                    height: '24px',
                    color: 'var(--font-b)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {_.first(reportedBy ? reportedBy : lastTestedBy ? lastTestedBy : '-')}
                </div>
              )}

              <span>{reportedBy ? reportedBy : lastTestedBy ? lastTestedBy : '-'}</span>
            </div>
          </div>
          <div>
            <span>{`${formattedDate(date, 'dd MMM, yyyy')} at ${formattedDate(date, 'h:mm a')}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upcoming;
