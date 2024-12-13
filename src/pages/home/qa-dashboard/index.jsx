import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';
import { isEqual } from 'lodash';

import { useAppContext } from 'context/app-context';

import ValueBox from 'components/value-box';
import SkeletonCard from 'components/skeleton-loaders/card-skeleton';
import ValuePalette from 'components/value-palette';

import { useToaster } from 'hooks/use-toaster';

import { useGetMyReportedBugsWidget, useGetQaAnalytics } from 'api/v1/dashboard/dashboard';
import { useGetTestRunsByFilter } from 'api/v1/test-runs/test-runs';

import style from './qa-dashboard.module.scss';
import ExpandableCard from './expandable-card';
import Report from '../report';
import ExpandableTable from './expandable-table';

const QaDashboard = ({ viewAs }) => {
  const containerRef = useRef();
  const { control, watch } = useForm();
  const { userDetails } = useAppContext();
  const { toastError } = useToaster();

  const [qaAnalytics, setQaAnalytics] = useState({});

  const [myReportedBugs, setMyReportedBugs] = useState({
    blocked: { totalCount: 0, bugs: [] },
    needToDiscuss: { totalCount: 0, bugs: [] },
    reproducible: { totalCount: 0, bugs: [] },
    open: { totalCount: 0, bugs: [] },
  });
  const [testRuns, setTestRuns] = useState({});

  const { mutateAsync: _getAllTestRuns, isLoading: _isLoading } = useGetTestRunsByFilter();

  const fetchTestRuns = useCallback(
    async (filters) => {
      try {
        const response = await _getAllTestRuns(filters);
        setTestRuns((pre) => ({
          ...(pre || {}),
          count: response?.count || 0,
          testruns: [...(pre?.testruns || []), ...(response?.testruns || [])],
        }));
      } catch (error) {
        toastError(error);
      }
    },
    [toastError, _getAllTestRuns],
  );

  console.log(userDetails, 'userDetails');

  useEffect(() => {
    fetchTestRuns({
      search: '',
      status: [],
      assignedTo: viewAs ? [viewAs] : [userDetails?.id],
      projectId: [],
      createdBy: [],
      page: 0,
    });
  }, [fetchTestRuns, userDetails?.id, viewAs]);

  const [activeTab, setActiveTab] = useState('blocked');
  const [qaAnalyticsPage, setQaAnalyticsPage] = useState(1);

  const { isLoading: _QaAnalyticsLoading } = useGetQaAnalytics({
    ...(viewAs && { viewAs: viewAs }),
    onSuccess: (data) => {
      setQaAnalytics(data?.data);
    },
  });

  const { data: _qaAnalyticsData, isLoading: isRefetching } = useGetMyReportedBugsWidget({
    page: qaAnalyticsPage,
    perPage: 5,
    ...(viewAs && { viewAs: viewAs }),
    onSuccess: (data) => {
      const currentTab = activeTab;

      setMyReportedBugs((pre) => ({
        ...pre,
        [currentTab]: {
          totalCount: data?.data[currentTab]?.totalCount || 0,
          bugs:
            qaAnalyticsPage === 1
              ? data?.data[currentTab]?.bugs || []
              : [...(pre[currentTab]?.bugs || []), ...(data?.data[currentTab]?.bugs || [])],
        },
      }));
    },
  });

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = containerRef.current;

    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (myReportedBugs[activeTab]?.totalCount !== myReportedBugs[activeTab]?.bugs?.length && !isRefetching) {
        setQaAnalyticsPage((prev) => prev + 1);
        containerRef.current.scrollTo(scrollLeft, scrollTop - 10);
      }
    }
  }, [isRefetching, activeTab, myReportedBugs]);

  useEffect(() => {
    const containerRefCurrent = containerRef?.current;

    if (!isRefetching) {
      containerRefCurrent?.addEventListener('scroll', handleScroll);
    } else if (isRefetching) {
      containerRefCurrent?.removeEventListener('scroll', handleScroll);
    }

    return () => {
      containerRefCurrent?.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, _qaAnalyticsData, isRefetching, activeTab, handleScroll]);

  return (
    <>
      <div className={style.mainWrapper}>
        {_isLoading || _QaAnalyticsLoading ? (
          <SkeletonCard
            count={5}
            wholeBoxClass={style.welcomeDivLoader}
            buttonClassName={style.welcomeDivLoaderBtn}
            containerClass={style.welcomeLoaderContainer}
          />
        ) : (
          <div className={style.upperDiv}>
            <ValueBox
              link={`/qa-testing?reportedBy=${viewAs}`}
              className={style.boxWidth}
              heading={'My Reported Bugs'}
              value={qaAnalytics?.myReportedBugs}
            />
            <ValueBox
              link={`/qa-testing?reportedBy=${viewAs}&status=Closed`}
              className={style.boxWidth}
              heading={'Closed'}
              value={qaAnalytics?.closedBugs}
            />
            <ValueBox
              link={`/qa-testing?reportedBy=${viewAs}&status=Open`}
              className={style.boxWidth}
              heading={'Opened'}
              value={qaAnalytics?.openedBugs}
            />
            <ValueBox
              link={`/qa-testing?reportedBy=${viewAs}&status=Reproducible`}
              className={style.boxWidth}
              heading={'Reproducible'}
              value={qaAnalytics?.reproducibleBugs}
            />
            <ValueBox
              link={`/qa-testing?reportedBy=${viewAs}&status=Need+To+Discuss`}
              className={style.boxWidth}
              heading={'Need to Discuss'}
              value={qaAnalytics?.needToDiscussBugs}
            />
            <ValueBox
              link={`/qa-testing?reportedBy=${viewAs}&status=Blocked`}
              className={style.boxWidth}
              heading={'Blocked'}
              value={qaAnalytics?.blockedBugs}
            />
          </div>
        )}
        <div className={style.middleDiv}>
          {_isLoading || _QaAnalyticsLoading ? (
            <SkeletonCard
              count={1}
              wholeBoxClass={style.welcomeDivLoader}
              buttonClassName={style.welcomeDivLoaderBtn}
              containerClass={style.leftLoaderContainer}
            />
          ) : (
            <div className={style.left}>
              <Report control={control} watch={watch} userDetails={userDetails} />
              <div className={style.valueBoxDiv}>
                <ValueBox
                  heading={'Bug Closure Rate'}
                  value={qaAnalytics?.bugsClosureRateDays > 0 ? `${qaAnalytics?.bugsClosureRateDays} Days` : '-'}
                  className={style.valueBoxClass}
                />
                <ValuePalette heading={'Bugs Types'} className={style.valuePaletteClass} data={qaAnalytics?.bugTypes} />
              </div>
            </div>
          )}

          {_isLoading || _QaAnalyticsLoading ? (
            <SkeletonCard
              count={1}
              wholeBoxClass={style.welcomeDivLoader}
              buttonClassName={style.welcomeDivLoaderBtn}
              containerClass={style.rightLoaderContainer}
            />
          ) : (
            <div className={style.right}>
              <ExpandableCard title={'My Test Runs'} data={testRuns} />
            </div>
          )}
        </div>
        {_isLoading || _QaAnalyticsLoading ? (
          <div className={style.lowerDivLoader}>
            <SkeletonCard
              count={3}
              wholeBoxClass={style.welcomeDivLoader}
              buttonClassName={style.welcomeDivLoaderBtn}
              containerClass={style.bottomLoaderContainer}
            />
          </div>
        ) : (
          <div className={style.lowerDiv}>
            <ExpandableTable
              title={'My Reported Bugs'}
              data={myReportedBugs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              containerRef={containerRef}
              setQaAnalyticsPage={setQaAnalyticsPage}
              _isLoading={isRefetching}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(QaDashboard, (prevProps, nextProps) => isEqual(prevProps, nextProps));
