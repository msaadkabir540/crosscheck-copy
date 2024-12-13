import { useCallback, useState } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';
import { every as _every } from 'lodash';

import ReportBug from 'components/report-bug-modal';
import Loader from 'components/loader';
import Tags from 'components/tags';
import TabsMobile from 'components/tabs-mobile';

import { useToaster } from 'hooks/use-toaster';

import { useUpdateSeverityBug, useGetBugById } from 'api/v1/bugs/bugs';

import noData from 'assets/no-found.svg';

import Detail from './detail';
import More from './more';
import History from './history';
import Activities from './activities';
import TaskHistory from './task-history';
import Comments from './comments';
import style from './drawer.module.scss';
import Icon from '../../../components/icon/themed-icon';
import ClickUpMenu from '../../../components/click-up-menu';

const ViewBug = ({
  viewBug,
  setDrawerOpen,
  setViewBugId,
  viewBugId,
  noHeader,
  setRetestOpen,
  setOpenDelModal,
  setEditRecord,
  setIsStartTesting,
  setIsAddTestCase,
  setDuplicateRecord,
  copyDataToClipboard,
  setSelectedBugs,
  setOpenTaskModal,
  selectedBugs,
  setSelectedRecords,
  selectedRunRecords,
  setViewTestRun,
  setSelectedRunRecords,
}) => {
  const [bugModal, setBugModal] = useState(false);
  const [activeCross, setActiveCross] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState();
  const [showAllTags, setShowAllTags] = useState(false);
  const bugId = searchParams.get('bugId');
  const { data: _bugDetailsData = {}, isFetching, refetch } = useGetBugById(viewBugId);

  const { id: _projectId } = useParams();

  const { toastSuccess, toastError } = useToaster();

  const toggleShowAllTags = useCallback(() => {
    setShowAllTags(!showAllTags);
  }, [showAllTags]);

  const { bug = {} } = _bugDetailsData;

  const handleRetestOpen = useCallback(() => {
    setRetestOpen(() => ({ open: true, id: bug?._id, refetch }));
    setOpen(false);
  }, [setRetestOpen, setOpen, bug, refetch]);

  const handleOpenDeleteModal = useCallback(() => {
    setOpenDelModal({
      open: true,
      id: bug?._id,
    });
  }, [setOpenDelModal, bug]);

  const optionMenu = [
    {
      bodyData: [
        {
          click: (e) => {
            e.preventDefault();
            setEditRecord({ id: bug?._id });
            setIsStartTesting({ open: true });
          },
          icon: <Icon name={'EditIconGrey'} iconClass={style.editColor} />,
          text: 'Edit',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () => setRetestOpen(() => ({ open: true, id: bug?._id })),
          icon: <Icon name={'RetestIcon'} iconClass={style.editColor} />,
          text: 'Retest',
        },
      ],
    },

    {
      bodyData: [
        {
          click: () =>
            window.open(bug?.history[bug?.history?.length - 1]?.reTestEvidence || bug?.testEvidence, '_blank'),
          icon: <Icon name={'EvidenceLink'} iconClass={style.editColor} />,
          text: 'View Evidence',
        },
      ],
    },
    {
      bodyData: [
        {
          click: (e) => {
            e.preventDefault();
            setDuplicateRecord({ id: bug?._id });
            setIsStartTesting({ open: true });
          },
          icon: <Icon name={'Duplicate'} iconClass={style.editColor} />,
          text: 'Duplicate Bug',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () => copyDataToClipboard(bug, true),
          icon: <Icon name={'CopyEvidenceIcon'} iconClass={style.editColor} />,
          text: 'Copy Evidence Link',
        },
      ],
    },
    {
      border: '1px solid #d6d6d6',
      bodyData: [
        {
          click: () => copyDataToClipboard(bug, false),
          icon: <Icon name={'CopyClipBoardIcon'} iconClass={style.editColor} />,
          text: 'Copy Bug Content',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () =>
            selectedBugs.length > 1
              ? _every(selectedBugs, (bug) => bug['projectId']?._id === selectedBugs[0]['projectId']?._id) &&
                setOpenTaskModal({ open: true })
              : (setSelectedBugs((prev) => [...prev, bug]),
                setSelectedRecords((pre) =>
                  pre.includes(bug._id) ? pre.filter((x) => x !== bug._id) : [...pre, bug._id],
                ),
                setOpenTaskModal({ open: true })),
          icon: <Icon name={'CreateTask'} iconClass={style.editColor} />,
          text: 'Create Task',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () => {
            if (viewBug) {
              setDrawerOpen(false);
              noHeader && setSearchParams({ active: 2 });
            }

            selectedRunRecords.length > 1
              ? _every(
                  selectedRunRecords,
                  (runRecord) => runRecord?.projectId?._id === selectedRunRecords[0]?.projectId?._id,
                ) && setViewTestRun(true)
              : (setSelectedRunRecords((prev) => [...prev, bug]), setViewTestRun(true));
          },
          icon: <Icon name={'TestRunIcon'} iconClass={style.editColor} />,
          text: 'Create Test Run',
        },
      ],
    },
    {
      border: '1px solid #d6d6d6',
      bodyData: [
        {
          click: () => {
            setIsAddTestCase({ open: true });
            setEditRecord({ id: bug?._id, type: 'bugs' });
          },
          icon: <Icon name={'ConvertIcon'} iconClass={style.editColor} />,
          text: 'Convert to Test Case',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () => handleOpenDeleteModal(),
          icon: <Icon name={'DelRedIcon'} />,
          text: 'Delete',
        },
      ],
    },
  ];

  const { mutateAsync: _changeSeverityHandler } = useUpdateSeverityBug();

  const onChangeSeverity = useCallback(
    async (id, value) => {
      try {
        const res = await _changeSeverityHandler({ id, body: { newSeverity: value } });
        toastSuccess(res.msg);
        setSearchParams({ bugId: bug?._id });
      } catch (error) {
        await refetch();
        toastError(error);
      }
    },
    [_changeSeverityHandler, setSearchParams, bug, refetch, toastSuccess, toastError],
  );

  const handlePreviousBug = useCallback(() => {
    if (_projectId ? _projectId === bug?.previousBug?.[0]?.projectId : true) {
      if (bug?.previousBug?.[0]?._id && bugId) {
        setSearchParams({
          bugId: bug?.previousBug?.[0]?.bugId,
        });
      } else if (bug?.previousBug?.[0]?._id) {
        setViewBugId(bug?.previousBug?.[0]?._id);
      }
    }
  }, [setSearchParams, setViewBugId, bug, bugId, _projectId]);

  const handleNextBug = useCallback(() => {
    if (_projectId ? _projectId === bug?.nextBug?.[0]?.projectId : true) {
      if (bug?.nextBug?.[0]?._id && bugId) {
        setSearchParams({
          bugId: bug?.nextBug?.[0]?.bugId,
        });
      } else if (bug?.nextBug?.[0]?._id) {
        setViewBugId(bug?.nextBug?.[0]?._id);
      }
    }
  }, [setSearchParams, setViewBugId, bug, bugId, _projectId]);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setViewBugId('');

    if (bugId) {
      if (noHeader) {
        setSearchParams({ active: 2 });
      } else {
        setSearchParams({});
      }
    }
  }, [setDrawerOpen, setViewBugId, bugId, noHeader, setSearchParams]);

  const handleSeverityLow = useCallback(() => {
    onChangeSeverity(bug?._id, 'Low');
  }, [onChangeSeverity, bug]);

  const handleSeverityMedium = useCallback(() => {
    onChangeSeverity(bug?._id, 'Medium');
  }, [onChangeSeverity, bug]);

  const handleSeverityHigh = useCallback(() => {
    onChangeSeverity(bug?._id, 'High');
  }, [onChangeSeverity, bug]);

  const handleSeverityCritical = useCallback(() => {
    onChangeSeverity(bug?._id, 'Critical');
  }, [onChangeSeverity, bug]);

  const handleToggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  return (
    <>
      <div className={style.main}>
        <div className={style.header}>
          <div className={style.nextBackBtn}>
            <div className={style.hover} id={'prevButton'} onClick={handlePreviousBug}>
              {}
              <Icon name={'ArrowLeft'} height={24} width={24} />
              <div className={style.tooltip}>
                <p>Back</p>
              </div>
            </div>
            <span className={style.headerText}>{bug.bugId}</span>
            <div className={style.hover} id={'nextButton'} onClick={handleNextBug}>
              {/* TODO:<ArrowRight type={!bug?.nextBug?.[0]?._id} /> */}
              <Icon name={'ArrowRight24'} height={24} width={24} />
              <div className={style.tooltip}>
                <p>Next</p>
              </div>
            </div>
          </div>
          <div onClick={handleCloseDrawer} className={style.hover1}>
            <Icon name={'CrossIcon'} />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        {bug?._id && !isFetching ? (
          <div className={`${style.body} ${style.bugDetail}`} style={{ height: noHeader ? '78vh' : '90vh' }}>
            <div className={style.contentHeader} style={{ height: noHeader ? '47%' : '' }}>
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
                      droppable
                      menu={[
                        {
                          title: 'Low',
                          click: handleSeverityLow,
                        },
                        {
                          title: 'Medium',
                          click: handleSeverityMedium,
                        },
                        {
                          title: 'High',
                          click: handleSeverityHigh,
                        },

                        {
                          title: 'Critical',
                          click: handleSeverityCritical,
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
                  <span>Tags</span>{' '}
                  <div className={style.tagsDiv}>
                    {!bug.tags.length
                      ? '-'
                      : bug?.tags?.slice(0, showAllTags ? bug.tags.length : 2).map((tag) => (
                          <div key={tag?._id} className={style.tag}>
                            <Icon name={'TagIcon'} />
                            <span>{tag?.name}</span>
                          </div>
                        ))}
                    {bug?.tags?.length > 2 && (
                      <span className={style.moreTagsText} onClick={toggleShowAllTags}>
                        {showAllTags ? 'Show less' : `${bug.tags.length - 2} more`}
                      </span>
                    )}
                  </div>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Status</span>{' '}
                  <span className={`${style.span2} ${style.tagText}`} onClick={handleRetestOpen}>
                    <Tags
                      text={bug?.status}
                      backClass={style.tagStyle}
                      colorScheme={{
                        Closed: '#34C369',
                        Open: '#F96E6E',
                        Blocked: '#F96E6E',
                        Reproducible: '#B79C11',
                        Reopen: 'rgba(222, 187, 0, 1)',
                        'Need To Discuss': '#11103D',
                      }}
                    />
                  </span>
                </div>
              </div>
            </div>
            <div className={style.tabsDiv}>
              <div className={style.tabsIconDiv}>
                <div className={style.hover} onClick={handleToggleOpen}>
                  <Icon name={'MoreDots'} />
                  <div className={style.tooltip}>
                    <p>Menu</p>
                  </div>
                </div>
              </div>
              <div className={style.menuDiv}>
                {open && (
                  <ClickUpMenu
                    noHeader={noHeader}
                    rightClickedRow={bug}
                    atMostRight={true}
                    setMenuOpen={setOpen}
                    menuData={optionMenu ?? []}
                  />
                )}
              </div>

              <div id="retestButton" className={style.resetClass} onClick={handleRetestOpen} />
              <TabsMobile
                pages={pages(bug, noHeader)}
                activeTab={activeCross}
                setActiveTab={setActiveCross}
                drawerMode
              />
            </div>
          </div>
        ) : isFetching ? (
          <div className={style.loaderClass}>
            <Loader />
          </div>
        ) : (
          <div className={style.loaderClass}>
            <img src={noData} alt="" />
          </div>
        )}
      </div>
      <ReportBug openDelModal={bugModal} setOpenDelModal={setBugModal} />
      {open && <div className={style.backdropDiv} onClick={handleClose}></div>}
    </>
  );
};

export default ViewBug;

const pages = (data, noHeader) => [
  {
    tabTitle: 'Detail',
    content: (
      <Detail
        feedback={data?.feedback}
        reproduceSteps={data?.reproduceSteps}
        idealBehaviour={data?.idealBehaviour}
        testEvidence={data?.testEvidence}
        testEvidenceKey={data?.testEvidenceKey}
        testedVersion={data?.testedVersion?.name}
        history={data?.history}
        testedDevice={data?.testedDevice}
        testedEnvironment={data?.testedEnvironment?.name}
      />
    ),
  },
  {
    tabTitle: 'Task History',
    content: <TaskHistory taskHistory={data?.taskHistory} />,
  },
  {
    tabTitle: 'Comments',
    content: <Comments noHeader={noHeader} bugId={data?._id} />,
  },
  {
    tabTitle: 'History',
    content: <History history={data.history} />,
  },
  {
    tabTitle: 'Activities',
    content: <Activities noHeader={noHeader} bugId={data?._id} />,
  },
  {
    tabTitle: 'More',
    content: <More data={data} />,
  },
];
