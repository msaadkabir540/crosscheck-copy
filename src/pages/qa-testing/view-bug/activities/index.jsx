import { useCallback, useEffect, useRef, useState } from 'react';

import _ from 'lodash';
import { formatDistanceToNow } from 'date-fns';

// NOTE: component
import Loader from 'components/loader';

// NOTE: hooks
import { useGetActivities } from 'api/v1/settings/activities';

// NOTE: assets
import noData from 'assets/no-found.svg';

// NOTE: styles
import style from './activity.module.scss';

const Activities = ({ bugId }) => {
  const containerRef = useRef(null);

  const [activities, setActivities] = useState([]);

  const {
    mutateAsync: _activitiesDataHandler,

    isLoading: isRefetching,
  } = useGetActivities();

  const fetchData = useCallback(async () => {
    const res = await _activitiesDataHandler({
      activityBy: [],
      activityType: [],
      ...(bugId && { bugId }),
    });

    setActivities(res?.activities);
  }, [_activitiesDataHandler, bugId]);

  useEffect(() => {
    fetchData();
  }, [fetchData, bugId]);

  return (
    <div
      style={{
        height: bugId ? '40vh' : '100vh',
      }}
      className={style.activity}
    >
      <div ref={containerRef} className={style.activityWrapper}>
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
                    <img alt="profilePicture" src={e?.activityBy?.profilePicture} className={style.profilePic} />
                  ) : (
                    <div className={style.activityBy}>{_.first(e?.activityBy?.name)}</div>
                  )}
                  <div className={style.activityContent}>
                    <span className={style.line}>{` ${e?.activityBy?.name} ${e?.activityText}`}</span>
                    {e?.descriptionText?.map((x) => {
                      return (
                        <span className={`${style.line} ${style.description}`} key={x}>
                          {x}
                        </span>
                      );
                    })}
                    <span>
                      {` ${formatDistanceToNow(new Date(e.activityAt), {
                        includeSeconds: true,
                      })}`}{' '}
                      ago
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={style.noDataClass}>
              <img src={noData} alt="noDataIcon" />
            </div>
          )}
        </div>
        {isRefetching && <Loader tableMode />}
      </div>
    </div>
  );
};

export default Activities;
