import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import _ from 'lodash';
import { useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useAppContext } from 'context/app-context';

import ReportBugModal from 'components/report-bug-modal';
import Loader from 'components/loader';
import Tags from 'components/tags';
import TabsMobile from 'components/tabs-mobile';

import { useToaster } from 'hooks/use-toaster';

import { useGetTestCaseById, useUpdateStatusTestCase } from 'api/v1/test-cases/test-cases';

import { every } from 'utils/lodash';

import noData from 'assets/no-found.svg';

import Detail from './detail';
import More from './more';
import History from './history';
import Activities from './activities';
import TaskHistory from './task-history';
import style from './drawer.module.scss';
import StatusUpdateModel from '../status-update-model';
import StartTestingModal from '../start-reporting-bugs';
import Icon from '../../../components/icon/themed-icon';
import ClickUpMenu from '../../../components/click-up-menu';

const ViewTestCase = ({
  setDrawerOpen,
  setViewTestCaseId,
  viewTestCaseId,
  setSelectedRecords,
  setViewTestRun,
  projectId,
  setDelModal,
  noHeader,
  setSelectedRunRecords,
  setDuplicateRecord,
  copyTestCaseToClipboard,
  refetchAll = () => {},
  testRunStatus = false,
  setIsAddTestCase,
  setStopDrag,
  setOpenTaskModal,
  setEditRecord,
  setSelectedBugs,
  selectedRunRecords,
  editRecord,
}) => {
  const { setValue, watch } = useForm();

  const { userDetails } = useAppContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const testCaseId = searchParams.get('testCaseId');
  const updateId = searchParams.get('update');
  const [open, setOpen] = useState();

  const [showAllTags, setShowAllTags] = useState(false);
  const [bugModal, setBugModal] = useState(false);
  const [, setModalDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isReportBug, setIsReportBug] = useState({ open: false });

  const [statusUpdateTestCaseId, setStatusUpdateTestCaseId] = useState();

  const { toastError, toastSuccess } = useToaster();

  useEffect(() => {
    if (updateId) {
      setStatusUpdateTestCaseId(updateId);
    }
  }, [updateId]);

  useEffect(() => {
    if (statusUpdateTestCaseId) {
      setStopDrag(true);
    } else {
      setStopDrag(false);
    }
  }, [setStopDrag, statusUpdateTestCaseId]);

  const toggleShowAllTags = useCallback(() => {
    setShowAllTags(!showAllTags);
  }, [showAllTags]);

  const { data: _testCaseData = {}, refetch, isLoading } = useGetTestCaseById(viewTestCaseId);

  const { testCase = {} } = _testCaseData;

  const optionMenu = [
    ...(userDetails?.role !== 'Developer'
      ? [
          {
            bodyData: [
              {
                click: (e) => {
                  e.preventDefault();
                  setIsAddTestCase({ open: true });
                  setEditRecord({ id: testCase?._id });
                },
                icon: <Icon name={'EditIconGrey'} iconClass={style.editColor} />,
                text: 'Edit',
              },
            ],
          },
        ]
      : []),

    {
      bodyData: [
        {
          icon: <Icon name={'ChangeStatus'} iconClass={style.editColor} />,
          text: 'Change Status',
          moreOptions: [
            {
              subText: 'Passed',
              optionClick: async function () {
                const res = await _updateStatusTestCase({
                  id: testCase._id,
                  body: { testStatus: 'Passed', source: 'Test Case' },
                });
                toastSuccess(res?.msg);
                refetchAll(testCase._id, 'edit', res?.testCaseData);
                refetch();
              },
            },
            {
              subText: 'Failed',
              optionClick: async function () {
                const res = await _updateStatusTestCase({
                  id: testCase._id,
                  body: { testStatus: 'Failed', source: 'Test Case' },
                });
                toastSuccess(res?.msg);
                refetchAll(testCase._id, 'edit', res?.testCaseData);
                refetch();
              },
            },
            {
              subText: 'Blocked',
              optionClick: async function () {
                const res = await _updateStatusTestCase({
                  id: testCase._id,
                  body: { testStatus: 'Blocked', source: 'Test Case' },
                });
                toastSuccess(res?.msg);
                refetchAll(testCase._id, 'edit', res?.testCaseData);
                refetch();
              },
            },
            {
              subText: 'Not Tested',
              optionClick: async function () {
                const res = await _updateStatusTestCase({
                  id: testCase._id,
                  body: { testStatus: 'Not Tested', source: 'Test Case' },
                });
                toastSuccess(res?.msg);
                refetchAll(testCase._id, 'edit', res?.testCaseData);
                refetch();
              },
            },
          ],
        },
      ],
    },
    {
      bodyData: [
        {
          click: (e) => {
            e.preventDefault();
            setIsAddTestCase({ open: true });
            setDuplicateRecord({ id: testCase?._id });
          },
          icon: <Icon name={'Duplicate'} iconClass={style.editColor} />,
          text: 'Duplicate Test Case',
        },
      ],
    },
    {
      border: '1px solid #d6d6d6',
      bodyData: [
        {
          click: () => copyTestCaseToClipboard(testCase),
          icon: <Icon name={'CopyClipBoardIcon'} iconClass={style.editColor} />,
          text: 'Copy Test Case Content',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () =>
            selectedRunRecords.length > 1
              ? every(
                  selectedRunRecords,
                  (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                ) && setOpenTaskModal({ open: true })
              : (setSelectedBugs((prev) => [...prev, testCase]),
                setSelectedRecords((pre) =>
                  pre.includes(testCase._id) ? pre.filter((x) => x !== testCase._id) : [...pre, testCase._id],
                ),
                setOpenTaskModal({ open: true })),
          icon: <Icon name={'CreateTask'} iconClass={style.editColor} />,
          text: 'Create Task',
        },
      ],
    },
    {
      border: '1px solid #d6d6d6',
      bodyData: [
        {
          click: () => {
            if (ViewTestCase) {
              setDrawerOpen(false);
              noHeader && setSearchParams({ active: 1 });
            }

            selectedRunRecords.length > 1
              ? every(
                  selectedRunRecords,
                  (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                ) && setViewTestRun(true)
              : (setSelectedRunRecords((prev) => [...prev, testCase]), setViewTestRun(true));
          },
          icon: <Icon name={'TestRunIcon'} iconClass={style.editColor} />,
          text: 'Create Test Run',
        },
      ],
    },
    ...(userDetails?.role !== 'Developer'
      ? [
          {
            border: '1px solid #d6d6d6',
            bodyData: [
              {
                click: () =>
                  setDelModal({
                    open: true,
                    name: testCase?.testCaseId,
                    id: testCase?._id,
                  }),
                icon: <Icon name={'DelIcon'} iconClass={style.editColor1} />,
                text: 'Delete',
              },
            ],
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (testCase && !_.isEmpty(testCase)) {
      setValue('testStatus', testCase?.status);
    }
  }, [setValue, testCase]);

  const { mutateAsync: _updateStatusTestCase, isLoading: _isStatusUpdating } = useUpdateStatusTestCase();

  const statusUpdateHandler = useCallback(
    async (data) => {
      const body = {
        ...data,
        testEvidence: data?.testEvidence?.base64,
        source: 'Test Case',
      };
      const res = await _updateStatusTestCase({ id: statusUpdateTestCaseId, body });
      toastSuccess(res?.msg);
      setStatusUpdateTestCaseId('');
      setModalDismissed(false);
      setStopDrag(false);
      await refetch();
      refetchAll(statusUpdateTestCaseId, 'edit', res?.testCaseData);
    },
    [_updateStatusTestCase, refetch, refetchAll, setStopDrag, statusUpdateTestCaseId, toastSuccess],
  );

  const onStatusUpdate = useCallback(
    async (data, setError) => {
      if (data?.testStatus === 'Failed') {
        setBugModal(data);
      } else {
        try {
          await statusUpdateHandler(data);
        } catch (error) {
          toastError(error, setError);
        }
      }
    },
    [statusUpdateHandler, toastError],
  );

  const bugModelCloseHandler = useCallback(async () => {
    setBugModal('');
    await statusUpdateHandler(bugModal);
  }, [bugModal, statusUpdateHandler]);

  const handlePrev = useCallback(() => {
    if (testCase?.previousTestCase?.[0]?._id && testCaseId) {
      setSearchParams({
        testCaseId: testCase?.previousTestCase?.[0]?.testCaseId,
      });
    } else if (testCase?.previousTestCase?.[0]?._id) {
      setViewTestCaseId(testCase?.previousTestCase?.[0]?._id);
    }
  }, [setSearchParams, setViewTestCaseId, testCase?.previousTestCase, testCaseId]);

  const handleNext = useCallback(() => {
    if (testCase?.nextTestCase?.[0]?._id && testCaseId) {
      setSearchParams({
        testCaseId: testCase.nextTestCase[0].testCaseId,
      });
    } else if (testCase?.nextTestCase?.[0]?._id) {
      setViewTestCaseId(testCase.nextTestCase[0]._id);
    }
  }, [setSearchParams, setViewTestCaseId, testCase.nextTestCase, testCaseId]);

  const handleCross = useCallback(() => {
    setDrawerOpen(false);
    setViewTestCaseId('');
    setStopDrag(false);

    if (testCaseId) {
      if (noHeader) {
        setSearchParams({ active: 1 });
      } else {
        setSearchParams({});
      }
    }
  }, [noHeader, setDrawerOpen, setSearchParams, setStopDrag, setViewTestCaseId, testCaseId]);

  const handleStatusUpdate = useCallback(
    (e) => {
      if (userDetails?.role !== 'Developer') {
        e.preventDefault();
        setStatusUpdateTestCaseId(testCase._id);
        setStopDrag(true);
      }
    },
    [userDetails?.role, testCase._id, setStopDrag],
  );

  const handleDotsClick = useCallback(() => {
    setOpen((pre) => !pre);
  }, []);

  const createHandleUpdate = useCallback(
    (testCase) => () => {
      if (userDetails?.activePlan === 'Free') {
        statusUpdateHandler(bugModal);
      } else {
        setIsReportBug({ open: true });
        setEditRecord({ id: testCase._id, type: 'testCases', refetch: refetch });
        setBugModal(false);
        setModalDismissed(true);
        setStatusUpdateTestCaseId(false);
      }
    },
    [userDetails?.activePlan, statusUpdateHandler, bugModal, setEditRecord, refetch],
  );

  const handleSetBugModal = useCallback(() => {
    setBugModal('');
  }, []);

  const handleSetOpenFalse = useCallback(() => setOpen(false), []);

  const handleSetIsReport = useCallback(() => {
    setIsReportBug({ open: false });
    setStopDrag(false);
  }, [setStopDrag]);

  return (
    <>
      <div className={style.main}>
        <div className={style.header}>
          <div className={style.flexClass}>
            <div className={style.hover} id={'prevButton'} onClick={handlePrev}>
              {}
              <Icon name={'ArrowLeft'} height={24} width={24} />
              <div className={style.tooltip}>
                <p>Back</p>
              </div>
            </div>
            <span className={style.headerText}>{testCase?.testCaseId}</span>
            <div className={style.hover} id={'nextButton'} onClick={handleNext}>
              {}
              <Icon name={'ArrowRight24'} height={24} width={24} />
              <div className={style.tooltip}>
                <p>Next</p>
              </div>
            </div>
          </div>
          <div className={style.flexClass}>
            {testRunStatus && <p className={style.tag}>Tested</p>}
            <div onClick={handleCross} className={style.hover1}>
              <Icon name={'CrossIcon'} />
            </div>
          </div>
        </div>
        {testCase?._id && !isLoading ? (
          <div
            className={style.body}
            style={{
              height: noHeader ? '78vh' : '90vh',
            }}
          >
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Project</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.projectId?.name}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Milestone</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.milestoneId?.name}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Feature</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.featureId?.name}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Test Type</span>
              </div>
              <div className={style.innerRight}>
                <Tags
                  text={testCase?.testType}
                  backClass={style.tagStyle}
                  colorScheme={{
                    UI: '#A2FF86',
                    Functionality: '#c70039',
                    Security: '#d988b9',
                    Performance: '#e25e3e',
                  }}
                />
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Weightage</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.weightage}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Related Task ID</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.relatedTicketId}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Tags</span>
              </div>
              <div className={style.tagsDiv}>
                {testCase?.tags?.slice(0, showAllTags ? testCase.tags.length : 2).map((tag) => (
                  <div key={tag?.name} className={style.tagCustom}>
                    <Icon name={'TagIcon'} />
                    <span>{tag?.name}</span>
                  </div>
                ))}
                {testCase?.tags?.length > 2 && (
                  <span className={style.moreTagsText} onClick={toggleShowAllTags}>
                    {showAllTags ? 'Show less' : `${testCase.tags.length - 2} more`}
                  </span>
                )}
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>State</span>
              </div>
              <div className={`${style.flexZero} ${style.innerRight}`}>
                <Tags
                  text={testCase?.state}
                  backClass={style.tagStyle}
                  colorScheme={{
                    Active: '#34C369',
                    Obsolete: '#8B909A',
                  }}
                />
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Status </span>
              </div>
              <div className={style.innerRight}>
                {testCase?.status && !statusUpdateTestCaseId && (
                  <span className={style.pointer} onClick={handleStatusUpdate} data-cy="status-click-viewtestcase">
                    <Tags
                      text={testCase?.status}
                      backClass={style.tagStyle}
                      colorScheme={{
                        Failed: '#F96E6E',
                        Passed: '#34C369',
                        Blocked: '#F80101',
                        'Not Tested': '#656F7D',
                      }}
                    />
                  </span>
                )}
              </div>
            </div>

            <div className={style.tabsDiv}>
              <div className={style.tabsIconDiv}>
                <div className={style.hover} onClick={handleDotsClick}>
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
                    rightClickedRow={testCase}
                    atMostRight={true}
                    setMenuOpen={setOpen}
                    menuData={optionMenu ?? []}
                  />
                )}
              </div>
              <TabsMobile drawerMode pages={pages(testCase)} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
        ) : isLoading ? (
          <div className={style.loaderClass}>
            <Loader />
          </div>
        ) : (
          <div className={style.loaderClass}>
            <img src={noData} alt="noDataIcon" />
          </div>
        )}
      </div>

      {statusUpdateTestCaseId && (
        <StatusUpdateModel
          statusUpdateTestCaseId={statusUpdateTestCaseId}
          setStatusUpdateTestCaseId={setStatusUpdateTestCaseId}
          handleClick={onStatusUpdate}
          isLoading={_isStatusUpdating}
        />
      )}

      {bugModal && (
        <ReportBugModal
          openDelModal={bugModal}
          closeHandler={bugModelCloseHandler}
          clickHandler={createHandleUpdate}
          locked={userDetails?.activePlan === 'Free'}
          setOpenDelModal={handleSetBugModal}
          setModalDismissed={setModalDismissed}
          isStatusUpdating={_isStatusUpdating}
        />
      )}

      {isReportBug?.open && (
        <StartTestingModal
          open={isReportBug.open}
          handleClose={handleSetIsReport}
          refetch={refetchAll}
          projectId={projectId}
          editRecord={editRecord}
          statusData={watch()}
          setEditRecord={setEditRecord}
        />
      )}

      {open && <div className={style.backdropDiv} onClick={handleSetOpenFalse}></div>}
    </>
  );
};

ViewTestCase.propTypes = {
  setDrawerOpen: PropTypes.func.isRequired,
  setViewTestCaseId: PropTypes.func.isRequired,
  viewTestCaseId: PropTypes.string,
  setAllowResize: PropTypes.func.isRequired,
  setReportBug: PropTypes.func.isRequired,
  setDelModal: PropTypes.func.isRequired,
  setEditRecord: PropTypes.func.isRequired,
  noHeader: PropTypes.bool.isRequired,
  refetchAll: PropTypes.func,
  testRunStatus: PropTypes.bool,
};

export default ViewTestCase;

const pages = (data) => [
  {
    tabTitle: 'Detail',
    content: <Detail data={data} />,
  },
  {
    tabTitle: 'Task History',
    content: <TaskHistory data={data} />,
  },
  {
    tabTitle: 'History',
    content: <History data={data} />,
  },
  {
    tabTitle: 'Activities',
    content: <Activities noHeader testCaseId={data?._id} />,
  },
  {
    tabTitle: 'More',
    content: <More data={data} />,
  },
];
