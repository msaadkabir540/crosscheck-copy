import React, { useState } from 'react';

import { isEqual } from 'lodash';

import ValueBox from 'components/value-box';
import SkeletonCard from 'components/skeleton-loaders/card-skeleton';

import {
  useGetAssignedBugsWidget,
  useGetDevAnalytics,
  useGetHighSeverityBugsWidget,
  useGetOpenedBugsWidget,
  useGetReproducibleBugsWidget,
} from 'api/v1/dashboard/dashboard';

import style from './dev-dashboard.module.scss';
import ExpandableCard from './expandable-card';

const DevDashboard = ({ viewAs }) => {
  const [devAnalytics, setDevAnalytics] = useState({});
  const [highSeverityBugs, setHighSeverityBugs] = useState({});
  const [reproducibleBugs, setReproducibleBugs] = useState({});
  const [assignedBugs, setAssignedBugs] = useState({});
  const [openedBugs, setOpenedBugs] = useState({});

  // NOTE: Get High Severity Bugs Widget DAta
  const { isLoading: _isLoading } = useGetDevAnalytics({
    ...(viewAs && { viewAs: viewAs }),
    onSuccess: (data) => {
      setDevAnalytics(data?.data);
    },
  });

  // NOTE: Get High Severity Bugs Widget DAta
  const { isLoading: isRefetching } = useGetHighSeverityBugsWidget({
    page: 0,
    perPage: 25,
    ...(viewAs && { viewAs: viewAs }),
    onSuccess: (data) => {
      setHighSeverityBugs(data?.highSeverityBugs);
    },
  });

  // NOTE: Get High Severity Reproducible Widget Data
  const { isLoading: isRefetchingReproducible } = useGetReproducibleBugsWidget({
    page: 0,
    perPage: 25,
    ...(viewAs && { viewAs: viewAs }),
    onSuccess: (data) => {
      setReproducibleBugs(data?.reproducibleBugs);
    },
  });

  // NOTE: Get Assigned bug Widget Data
  const { isLoading: isRefetchingAssignedBugs } = useGetAssignedBugsWidget({
    page: 0,
    perPage: 25,
    ...(viewAs && { viewAs: viewAs }),
    onSuccess: (data) => {
      setAssignedBugs(data?.assignedBugs);
    },
  });

  // NOTE: Get Opened Reproducible Widget Data
  const { isLoading: isRefetchingOpenedBugs } = useGetOpenedBugsWidget({
    page: 0,
    perPage: 25,
    ...(viewAs && { viewAs: viewAs }),
    onSuccess: (data) => {
      setOpenedBugs(data?.openBugs);
    },
  });

  return (
    <>
      <div className={style.mainWrapper}>
        {_isLoading || isRefetching || isRefetchingReproducible || isRefetchingAssignedBugs ? (
          <SkeletonCard
            count={5}
            wholeBoxClass={style.welcomeDivLoader}
            buttonClassName={style.welcomeDivLoaderBtn}
            containerClass={style.welcomeLoaderContainer}
          />
        ) : (
          <div className={style.upperDiv}>
            <ValueBox
              link={`/qa-testing?assignedTo=${viewAs}`}
              className={style.boxWidth}
              heading={'My Bugs'}
              value={devAnalytics?.myBugs}
            />
            <ValueBox
              link={`/qa-testing?assignedTo=${viewAs}&status=Closed`}
              className={style.boxWidth}
              heading={'Closed'}
              value={devAnalytics?.closedBugs}
            />
            <ValueBox
              link={`/qa-testing?assignedTo=${viewAs}&status=Open`}
              className={style.boxWidth}
              heading={'Opened'}
              value={devAnalytics?.openBugs}
            />
            <ValueBox
              link={`/qa-testing?assignedTo=${viewAs}&status=Reproducible`}
              className={style.boxWidth}
              heading={'Reproducible'}
              value={devAnalytics?.reproducibleBugs}
            />
            <ValueBox
              link={`/qa-testing?assignedTo=${viewAs}&status=Need+To+Discuss`}
              className={style.boxWidth}
              heading={'Need to Discuss'}
              value={devAnalytics?.needToDiscusBugs}
            />
            <ValueBox
              link={`/qa-testing?assignedTo=${viewAs}&status=Blocked`}
              className={style.boxWidth}
              heading={'Blocked'}
              value={devAnalytics?.blocked}
            />
          </div>
        )}
        <div className={style.middleDiv}>
          {_isLoading || isRefetching || isRefetchingReproducible || isRefetchingAssignedBugs ? (
            <SkeletonCard
              count={1}
              wholeBoxClass={style.welcomeDivLoader}
              buttonClassName={style.welcomeDivLoaderBtn}
              containerClass={style.leftLoaderContainer}
            />
          ) : (
            <div className={style.left}>
              <div className={style.activeProjects}>
                <h2>Active Projects</h2>
                {devAnalytics?.activeProjects?.map((item) => {
                  return (
                    <div className={style.projectsBar} key={item?.name}>
                      <span>{item?.name}</span>
                      <span className={style.secondSpan}>{item?.notClosedBugs}</span>
                    </div>
                  );
                })}
              </div>
              <div className={style.valueBoxDiv}>
                <ValueBox
                  heading={'Bugs Reproducible Rate'}
                  value={`${devAnalytics?.reproducibleBugsRate}%`}
                  className={style.valueBoxClass}
                />
                <ValueBox
                  heading={'Bug Closure Rate'}
                  value={`${devAnalytics?.avgDaysToClose} Days`}
                  className={style.valueBoxClass}
                />
              </div>
            </div>
          )}
          {_isLoading || isRefetching || isRefetchingReproducible || isRefetchingAssignedBugs ? (
            <SkeletonCard
              count={1}
              wholeBoxClass={style.welcomeDivLoader}
              buttonClassName={style.welcomeDivLoaderBtn}
              containerClass={style.rightLoaderContainer}
            />
          ) : (
            <div className={style.right}>
              <ExpandableCard title={'My Recent Opened Bugs'} data={!isRefetchingOpenedBugs && openedBugs} reportedBy />
            </div>
          )}
        </div>
        {_isLoading || isRefetching || isRefetchingReproducible || isRefetchingAssignedBugs ? (
          <div className={style.lowerDiv}>
            <SkeletonCard
              count={3}
              wholeBoxClass={style.welcomeDivLoader}
              buttonClassName={style.welcomeDivLoaderBtn}
              containerClass={style.bottomLoaderContainer}
            />
          </div>
        ) : (
          <div className={style.lowerDiv}>
            <div className={style.innerCards}>
              <ExpandableCard
                maxHeight={'365px'}
                data={highSeverityBugs}
                reportedBy
                title={'Critical / High Severity Bugs'}
              />
            </div>
            <div className={style.innerCards}>
              <ExpandableCard maxHeight={'365px'} data={reproducibleBugs} lastTestedBy title={'Reproducible Bugs'} />
            </div>
            <div className={style.innerCards}>
              <ExpandableCard maxHeight={'365px'} title={'Current Assigned Bugs'} reportedBy data={assignedBugs} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(DevDashboard, (prevProps, nextProps) => isEqual(prevProps, nextProps));
