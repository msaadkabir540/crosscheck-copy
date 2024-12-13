import { useCallback, useState } from 'react';

import RetestModal from 'pages/qa-testing/retest-modal';

import Loader from 'components/loader';
import Tags from 'components/tags';
import TabsMobile from 'components/tabs-mobile';

import { useGetBugById } from 'api/v1/bugs/bugs';

import noData from 'assets/no-found.svg';

import Detail from './detail';
import More from './more';
import History from './history';
import Activities from './activities';
import TaskHistory from './task-history';
import Comments from './comments';
import style from './drawer.module.scss';
import Icon from '../../../../components/icon/themed-icon';

const ViewBug = ({
  setDrawerOpen,
  viewReportedBugs,
  setViewBugIndex,
  viewBugIndex,
  allData,
  testRunId,
  noHeader,
  testRunStatus,
  refetchAll,
  _bugOptions,
}) => {
  const [activeCross, setActiveCross] = useState(0);
  const [retestOpen, setRetestOpen] = useState({ open: false });

  const {
    data: _bugDetailsData = {},
    isLoading,
    refetch,
  } = useGetBugById(viewReportedBugs ? allData?.[viewBugIndex]?._id : allData?.[viewBugIndex]?.bugId?._id);

  const { bug = {} } = _bugDetailsData;

  const moveToNextBug = useCallback(() => {
    setTimeout(() => {
      setViewBugIndex((pre) => (pre < allData?.length - 1 ? pre + 1 : pre));
    }, 1000);
  }, [allData?.length, setViewBugIndex]);

  const handlePrevious = useCallback(() => setViewBugIndex((pre) => (pre > 0 ? pre - 1 : pre)), [setViewBugIndex]);

  const handleNext = useCallback(
    () => setViewBugIndex((pre) => (pre < allData?.length - 1 ? pre + 1 : pre)),
    [allData?.length, setViewBugIndex],
  );

  const handleClose = useCallback(() => {
    setDrawerOpen(false);
    setViewBugIndex(null);
  }, [setDrawerOpen, setViewBugIndex]);

  const handleRetestOpen = useCallback(() => {
    setRetestOpen(() => ({ open: true, id: bug?._id, refetch }));
  }, [bug?._id, refetch]);

  const handleRetestClose = useCallback(() => {
    setRetestOpen({ open: false });
  }, []);

  return (
    <>
      <div className={style.main}>
        <div className={style.header}>
          <div className={style.headerInner}>
            <div id={'prevButton'} className={style.hover} onClick={handlePrevious}>
              <Icon name={'ArrowLeft'} />
              <div className={style.tooltip}>
                <p>Back</p>
              </div>
            </div>
            <span className={style.headerText}>{bug?.bugId}</span>
            <div id={'nextButton'} className={style.hover} onClick={handleNext}>
              {/* TODO: <ArrowRight type={viewBugIndex === allData?.length - 1} /> */}
              <Icon name={'ArrowRight24'} />
              <div className={style.tooltip}>
                <p>Next</p>
              </div>
            </div>
          </div>
          <div className={style.headerInner}>
            {testRunStatus && (
              <p className={`${allData?.[viewBugIndex]?.tested ? style.tag2 : style.tag}`}>
                {allData?.[viewBugIndex]?.tested ? 'Tested' : 'Not Tested'}
              </p>
            )}
            <div onClick={handleClose} className={style.hover1}>
              <Icon name={'CrossIcon'} />
              <div className={style.tooltip}>
                <p>Close</p>
              </div>
            </div>
          </div>
        </div>
        {bug?._id && !isLoading ? (
          <div
            className={style.body}
            style={{
              height: noHeader ? '78vh' : '90vh',
            }}
          >
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <div className={style.innerLeftWrapper}>
                  <span>Project</span>{' '}
                  <span className={style.span2}>{bug?.projectId?.name ? bug?.projectId?.name : '-'}</span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Milestone</span>{' '}
                  <span className={style.span2}>{bug?.milestoneId?.name ? bug?.milestoneId?.name : '-'}</span>
                </div>

                <div className={style.innerLeftWrapper}>
                  <span>Feature</span>{' '}
                  <span className={style.span2}>{bug?.featureId?.name ? bug?.featureId?.name : '-'}</span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Bug Type</span> <span className={style.span2}>{bug?.bugType ? bug?.bugType : '-'}</span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Bug Subtype</span>
                  <span className={style.span2}>{bug?.bugSubType ? bug?.bugSubType : '-'}</span>
                </div>

                <div className={style.innerLeftWrapper}>
                  <span>Severity</span>
                  <span className={`${style.span2} ${style.tagText}`}>
                    <Tags
                      droppable={viewReportedBugs ? false : true}
                      menu={[
                        {
                          title: 'Low',
                        },
                        {
                          title: 'Medium',
                        },
                        {
                          title: 'High',
                        },

                        {
                          title: 'Critical',
                        },
                      ]}
                      backClass={style.tagStyle}
                      text={bug?.severity}
                      colorScheme={{
                        Low: '#4F4F6E',
                        High: '#F96E6E',
                        Medium: '#B79C11',
                        Critical: '#F80101',
                      }}
                    />
                  </span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span> Task ID</span> <span className={style.span2}>{bug?.taskId ? bug?.taskId : '-'}</span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Developer Name</span>{' '}
                  <span className={style.span2}>{bug?.developerId?.name ? bug?.developerId?.name : '-'}</span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Status</span>{' '}
                  <span
                    className={`${style.span2} ${style.tagText} ${style.pointer}`}
                    onClick={!viewReportedBugs && handleRetestOpen}
                  >
                    <Tags
                      text={bug?.status}
                      backClass={style.tagStyle}
                      colorScheme={{
                        Closed: '#34C369',
                        Open: '#F96E6E',
                        Blocked: '#F96E6E',
                        Reproducible: '#B79C11',
                        'Need To Discuss': '#11103D',
                      }}
                    />
                  </span>
                </div>
              </div>
            </div>

            <div className={style.tabsDiv}>
              <TabsMobile pages={pages(bug)} activeTab={activeCross} setActiveTab={setActiveCross} drawerMode />
            </div>
          </div>
        ) : isLoading ? (
          <div className={style.loadingDiv}>
            <Loader />
          </div>
        ) : (
          <div className={style.loadingDiv}>
            <img src={noData} alt="noDataIcon" />
          </div>
        )}
      </div>

      {retestOpen && (
        <RetestModal
          openRetestModal={retestOpen}
          setOpenRetestModal={handleRetestClose}
          options={_bugOptions}
          refetch={refetch}
          testRunId={testRunId}
          refetchAll={refetchAll}
          moveToNextBug={moveToNextBug}
          isInViewMode={true}
        />
      )}
    </>
  );
};

export default ViewBug;

const pages = (data) => [
  {
    tabTitle: 'Detail',
    content: (
      <Detail
        feedback={data?.feedback}
        reproduceSteps={data?.reproduceSteps}
        idealBehaviour={data?.idealBehaviour}
        testEvidence={data?.testEvidence}
        testEvidenceKey={data?.testEvidenceKey}
        testedVersion={data?.testedVersion}
        history={data?.history}
      />
    ),
  },
  {
    tabTitle: 'Task History',
    content: <TaskHistory taskHistory={data?.taskHistory} />,
  },
  {
    tabTitle: 'Comments',
    content: <Comments bugId={data?._id} />,
  },
  {
    tabTitle: 'History',
    content: <History history={data.history} />,
  },
  {
    tabTitle: 'Activities',
    content: <Activities noHeader bugId={data?._id} />,
  },
  {
    tabTitle: 'More',
    content: <More data={data} />,
  },
];
