import { useEffect, useRef, useState } from 'react';

import _ from 'lodash';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';

// NOTE: components
import Loader from 'components/loader';

// NOTE: hooks
import { useGetActivities } from 'api/v1/settings/activities';

import noData from 'assets/no-found.svg';

import style from './activity.module.scss';

const Activities = ({ testCaseId }) => {
  const containerRef = useRef(null);

  const [activities, setActivities] = useState([]);

  const {
    mutateAsync: _activitiesDataHandler,

    isLoading: isRefetching,
  } = useGetActivities();

  const fetchData = async () => {
    const res = await _activitiesDataHandler({
      activityBy: [],
      activityType: [],
      ...(testCaseId && { testCaseId }),
    });

    setActivities(res?.activities);
  };

  useEffect(() => {
    fetchData();
  }, [testCaseId]);

  return (
    <div
      style={{
        height: testCaseId ? '50vh' : '100vh',
        overflow: 'hidden',
      }}
    >
      <div ref={containerRef} className={style.activityWrapper} style={{ height: '80vh', overflow: 'auto' }}>
        <div className={style.activitiesInner}>
          {activities?.length ? (
            activities?.map((e, i) => {
              return (
                <div className={style.activities} key={e?.activityBy?._id}>
                  <div
                    className={style.greyLine}
                    style={{
                      display: i === activities?.length - 1 ? 'none' : '',
                    }}
                  />

                  {e?.activityBy?.profilePicture ? (
                    <img
                      src={e?.activityBy?.profilePicture}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '80%',
                      }}
                      alt="activityBy-profilePicture"
                    />
                  ) : (
                    <div
                      style={{
                        borderRadius: '80%',
                        background: '#11103d',
                        width: '24px',
                        height: '24px',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {_.first(e?.activityBy?.name)}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className={style.line}>{` ${e?.activityBy?.name} ${e?.activityText}`}</span>{' '}
                    <span>
                      {` ${formatDistanceToNow(new Date(e.activityAt), {
                        // NOTE: addSuffix: true,
                        includeSeconds: true,
                      })}`}{' '}
                      ago
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100vh - 265px)',
              }}
            >
              <img src={noData} alt="noDataIcon" />
            </div>
          )}
        </div>
        {isRefetching && <Loader tableMode />}
      </div>
    </div>
  );
};

Activities.propTypes = {
  testCaseId: PropTypes.string.isRequired, // NOTE: Adjust the PropTypes based on the actual type
};
export default Activities;
