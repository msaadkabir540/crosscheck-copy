import { useCallback, useEffect, useMemo, useState } from 'react';

import Loader from 'components/loader';
import DynamicChart from 'components/apex-charts/dynamic-apex';

import { useGetActivities } from 'api/v1/settings/activities';
import { useGetTimeTrackingHistoryById } from 'api/v1/test-run-time-tracking/time-tracking';

import { formatRelativeTime } from 'utils/date-handler';

import user from 'assets/avatar.svg';
import redUp from 'assets/arrow-red-up.svg';
import redDown from 'assets/arrow-red-down.svg';
import greenUp from 'assets/arrow-green-up.svg';
import greenDown from 'assets/arrow-green-down.svg';

import { initialFilters } from './helper';
import style from './summary.module.scss';

const SummaryContent = ({ summaryData, runId, isLoading }) => {
  const [activities, setActivities] = useState([]);

  const { data: _timeTrackHistoryData = {} } = useGetTimeTrackingHistoryById(runId && runId);
  const { mutateAsync: _getActivities } = useGetActivities();

  const getActivities = useCallback(
    async (filters) => {
      const res = await _getActivities({
        ...filters,
        perPage: 25,
      });

      setActivities(res?.activities);
    },
    [_getActivities],
  );

  useEffect(() => {
    if (runId) {
      getActivities({ ...initialFilters, page: 0, runId: runId });
    }
  }, [getActivities, runId]);

  const totalOfBugTableBefore = useMemo(() => {
    return (
      summaryData?.testedBugsStatusBefore?.closed +
      summaryData?.testedBugsStatusBefore?.open +
      summaryData?.testedBugsStatusBefore?.blocked +
      summaryData?.testedBugsStatusBefore?.needToDiscuss +
      summaryData?.testedBugsStatusBefore?.reopen +
      summaryData?.testedBugsStatusBefore?.reproducible
    );
  }, [summaryData?.testedBugsStatusBefore]);

  const totalOfBugTableAfter = useMemo(() => {
    return (
      summaryData?.testedBugsStatusAfter?.closed +
      summaryData?.testedBugsStatusAfter?.open +
      summaryData?.testedBugsStatusAfter?.blocked +
      summaryData?.testedBugsStatusAfter?.needToDiscuss +
      summaryData?.testedBugsStatusAfter?.reopen +
      summaryData?.testedBugsStatusAfter?.reproducible
    );
  }, [summaryData?.testedBugsStatusAfter]);

  const bugTable = useMemo(
    () => [
      {
        label: 'Closed',
        beforeData: summaryData?.testedBugsStatusBefore?.closed,
        afterData: summaryData?.testedBugsStatusAfter?.closed,
        dot: <div className={`${style?.dotClosed} ${style?.dot}`} />,
        valuePercent: 5,
        class: style.closed,
        id: 1,
        up: greenUp,
        down: redDown,
      },
      {
        label: 'Open',
        beforeData: summaryData?.testedBugsStatusBefore?.open,
        afterData: summaryData?.testedBugsStatusAfter?.open,
        dot: <div className={`${style?.dotOpen} ${style?.dot}`} />,
        valuePercent: 5,
        class: style.open,
        id: 2,
        up: redUp,
        down: greenDown,
      },
      {
        label: 'Blocked',
        beforeData: summaryData?.testedBugsStatusBefore?.blocked,
        afterData: summaryData?.testedBugsStatusAfter?.blocked,
        dot: <div className={`${style?.dotBlocked} ${style?.dot}`} />,
        valuePercent: 5,
        class: style.blocked,
        id: 3,
        up: redUp,
        down: greenDown,
      },
      {
        label: 'Need to Discuss',
        beforeData: summaryData?.testedBugsStatusBefore?.needToDiscuss,
        afterData: summaryData?.testedBugsStatusAfter?.needToDiscuss,
        dot: <div className={`${style?.dotDiscuss} ${style?.dot}`} />,
        valuePercent: 5,
        class: style.needToDiscus,
        id: 4,
        up: redUp,
        down: greenDown,
      },
      {
        label: 'Reopened',
        beforeData: summaryData?.testedBugsStatusBefore?.reopen,
        afterData: summaryData?.testedBugsStatusAfter?.reopen,
        dot: <div className={`${style?.dotReopened} ${style?.dot}`} />,
        valuePercent: 5,
        class: style.reOpened,
        id: 5,
        up: redUp,
        down: greenDown,
      },
      {
        label: 'Reproducible',
        beforeData: summaryData?.testedBugsStatusBefore?.reproducible,
        afterData: summaryData?.testedBugsStatusAfter?.reproducible,
        dot: <div className={`${style?.dotReproducible} ${style?.dot}`} />,
        valuePercent: 5,
        class: style.reProd,
        id: 5,
        up: redUp,
        down: greenDown,
      },
    ],
    [summaryData],
  );

  const totalOfTestTableBefore = useMemo(() => {
    return (
      summaryData?.testCasesStatusBefore?.passed +
      summaryData?.testCasesStatusBefore?.failed +
      summaryData?.testCasesStatusBefore?.blocked +
      summaryData?.testCasesStatusBefore?.notTested
    );
  }, [summaryData?.testCasesStatusBefore]);

  const totalOfTestTableAfter = useMemo(() => {
    return (
      summaryData?.testCasesStatusAfter?.passed +
      summaryData?.testCasesStatusAfter?.failed +
      summaryData?.testCasesStatusAfter?.blocked +
      summaryData?.testCasesStatusAfter?.notTested
    );
  }, [summaryData?.testCasesStatusAfter]);

  const testTable = useMemo(
    () => [
      {
        label: 'Pass',
        beforeData: summaryData?.testCasesStatusBefore?.passed,
        afterData: summaryData?.testCasesStatusAfter?.passed,
        dot: <div className={`${style?.dotClosed} ${style?.dot}`} />,
        class: style.closed,
        id: 1,
        up: greenUp,
        down: redDown,
      },
      {
        label: 'Failed',
        beforeData: summaryData?.testCasesStatusBefore?.failed,
        afterData: summaryData?.testCasesStatusAfter?.failed,
        dot: <div className={`${style?.dotOpen} ${style?.dot}`} />,
        class: style.open,
        id: 2,
        up: redUp,
        down: greenDown,
      },
      {
        label: 'Blocked',
        beforeData: summaryData?.testCasesStatusBefore?.blocked,
        afterData: summaryData?.testCasesStatusAfter?.blocked,
        dot: <div className={`${style?.dotBlocked} ${style?.dot}`} />,
        class: style.blocked,
        id: 3,
        up: redUp,
        down: greenDown,
      },
      {
        label: 'Not Tested',
        beforeData: summaryData?.testCasesStatusBefore?.notTested,
        afterData: summaryData?.testCasesStatusAfter?.notTested,
        dot: <div className={`${style?.dotNotTested} ${style?.dot}`} />,
        class: style.notTested,
        id: 4,
        up: redUp,
        down: greenDown,
      },
    ],
    [summaryData],
  );

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={style.mainWrapper}>
          <div className={style.upperSection}>
            <div className={style.testingStatus}>
              <span>Testing Status</span>
              <DynamicChart
                chartType={'radialBar'}
                testStatusObj={summaryData?.testingStatus}
                height={300}
                data={summaryData?.testingStatus?.testedPercentage}
              />
            </div>
            <div className={style.coverageDefectDiv}>
              <div className={style.inner}>
                <span>Test Coverage</span>
                <h4>{`${summaryData?.testCoverage || 0.0}%`}</h4>
              </div>
              <div className={style.inner}>
                <span>Defect Density</span>
                <h4>{(summaryData?.defectDensity / 100 || 0.0).toFixed(2)}</h4>
              </div>
            </div>
            <div className={style.bugsReporting}>
              <span>Bugs Reported</span>
              <h4>{summaryData?.bugsReported?.total}</h4>
              <DynamicChart chartType={'bar'} height={160} data={summaryData?.bugsReported} />
            </div>
            <div className={style.timeTracking}>
              <span>Time Tracking</span>
              <div className={style.timeSection}>
                <div>
                  <p>
                    Total time: <span>{_timeTrackHistoryData?.overallDuration || '00:00:00'}</span>
                  </p>
                </div>
                <div>
                  <p>
                    Time per test: <span>{_timeTrackHistoryData?.timePerTest || '00:00:00'}</span>
                  </p>
                </div>
              </div>
              <div className={style.usersDiv}>
                {_timeTrackHistoryData?.timeEntries &&
                  _timeTrackHistoryData?.timeEntries?.map((x, index) => {
                    return (
                      <div className={style.row} key={x?.userId?._id}>
                        <div className={style.left}>
                          {x?.userId?.profilePicture ? (
                            <img src={x?.userId?.profilePicture || user} alt={`userprofile${index}`} />
                          ) : (
                            <span className={style.noNameIcon}>
                              {x?.userId?.name
                                ?.split(' ')
                                ?.slice(0, 2)
                                ?.map((word) => word[0]?.toUpperCase())
                                ?.join('')}
                            </span>
                          )}
                          <span>{x?.userId?.name}</span>
                        </div>
                        <h6>{x?.totalDuration}</h6>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className={style.lowerSection}>
            <div className={style.testCaseStatus}>
              <span>{summaryData?.runType === 'Bugs' ? 'Tested Bugs Status' : 'Test Cases Status'}</span>
              <div className={style.lowerPart}>
                <div className={style.comparison}>
                  <div className={style.before}>
                    <span>Before</span>
                    <DynamicChart
                      height={250}
                      chartType={'donut'}
                      bugType={summaryData?.runType === 'Bugs'}
                      data={
                        summaryData?.runType === 'Bugs'
                          ? summaryData?.testedBugsStatusBefore
                          : summaryData?.testCasesStatusBefore
                      }
                    />
                  </div>
                  <div className={style.after}>
                    <span>After</span>
                    <DynamicChart
                      after
                      height={250}
                      chartType={'donut'}
                      bugType={summaryData?.runType === 'Bugs'}
                      data={
                        summaryData?.runType === 'Bugs'
                          ? summaryData?.testedBugsStatusAfter
                          : summaryData?.testCasesStatusAfter
                      }
                    />
                  </div>
                </div>
                <div className={style.tableDiv}>
                  <div className={style.heading}>
                    <div className={style.leftSide}>
                      <p>Status</p>
                      <p>Before</p>
                    </div>
                    <div className={style.rightSide}>
                      <p>After</p>
                    </div>
                  </div>
                  {(summaryData?.runType === 'Bugs' ? bugTable : testTable)?.map((x) => {
                    return (
                      <div className={`${style.heading} ${x?.class}`} key={x?.id}>
                        <div className={style.leftSide}>
                          <div>
                            {x?.dot}
                            <label>{x?.label}</label>
                          </div>
                          <span className={style.hover}>
                            {x?.beforeData}
                            <div className={style.tooltip}>
                              <p>
                                {x?.beforeData},{' '}
                                {(
                                  (x?.beforeData /
                                    (summaryData?.runType === 'Bugs'
                                      ? totalOfBugTableBefore
                                      : totalOfTestTableBefore)) *
                                  100
                                )?.toFixed(1)}
                                %
                              </p>
                            </div>
                          </span>
                        </div>
                        <div className={`${style.rightSide}`}>
                          {x?.afterData !== x?.beforeData && (
                            <img src={x?.afterData < x?.beforeData ? x?.down : x?.up} alt="arrowHead" />
                          )}
                          <span className={style.hover}>
                            {x?.afterData}
                            <div className={style.tooltip}>
                              <p>
                                {x?.afterData},{' '}
                                {(
                                  (x?.afterData /
                                    (summaryData?.runType === 'Bugs' ? totalOfBugTableAfter : totalOfTestTableAfter)) *
                                  100
                                )?.toFixed(1)}
                                %
                              </p>
                            </div>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={style.activity}>
              <span> Activites</span>
              <div className={style.innerSection}>
                {activities &&
                  activities?.map((x, index) => {
                    return (
                      <div className={style.activityRow} key={x?._id}>
                        <div className={style.upper}>
                          {x?.activityBy?.profilePicture ? (
                            <img src={x?.activityBy?.profilePicture || user} alt={`userprofile${index}`} />
                          ) : (
                            <span className={style.noNameIcon}>
                              {x?.activityBy
                                ?.split(' ')
                                ?.slice(0, 2)
                                ?.map((word) => word[0]?.toUpperCase())
                                ?.join('')}
                            </span>
                          )}
                          <p>
                            {x?.activityBy?.name} {x?.activityText}
                          </p>
                        </div>
                        <div className={style.lower}>{formatRelativeTime(x?.updatedAt)}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryContent;
