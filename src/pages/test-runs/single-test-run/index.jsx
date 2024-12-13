import { useRef, useState, useEffect, useMemo, useCallback } from 'react';

import { Link, useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// NOTE: components
import { useAppContext } from 'context/app-context';

import { useBugsFiltersOptions } from 'pages/qa-testing/header/helper';

import GenericTable from 'components/generic-table';
import SplitPane from 'components/split-pane/split-pane';
import Button from 'components/button';
import Loader from 'components/loader';
import MultiColorProgressBar from 'components/progress-bar';
import TimeTracker from 'components/time-tracker';
import GenericModal from 'components/generic-modal';
import FilterChip from 'components/filter-chip';
import Menu from 'components/menu';
import MainWrapper from 'components/layout/main-wrapper';
import Permissions from 'components/permissions';

import { useToaster } from 'hooks/use-toaster';

import { useCloseTestRuns, useGetTestRunById, useGetTestRunBugsById } from 'api/v1/test-runs/test-runs';
import { useGetUserById } from 'api/v1/settings/user-management';

import { debounce as _debounce, isEmpty as _isEmpty, pick as _pick } from 'utils/lodash';
import { sortData } from 'utils/sorting-handler';
import { formattedDate } from 'utils/date-handler';

import right from 'assets/arrow-right.svg';
import noData from 'assets/no-found.svg';

import Tabs from '../../../components/tabs';
import StartTestingModal from './start-reporting-bugs';
import AddTestCaseModal from './add-test-case';
// NOTE: utils
import { columnsBugsData, columnsData, columnsBugsReportedData, useProjectOptions } from './helper';
import CloseTestRun from './close-test-run';
import ViewTestCase from './view-test-cases';
import ViewBug from './view-bug';
import WarningTestRun from './warning-test-run';
import style from './test-run.module.scss';
import Icon from '../../../components/icon/themed-icon';
import SelectTestCases from '../select-test-cases';
import {
  useAddMoreTestCases,
  useDeleteTestCasesFromRun,
  useDeleteBugsFromRun,
  useGetTestSummaryById,
} from '../../../api/v1/test-runs/test-runs';
import SummaryContent from './summary-content';

const TestRunSingle = ({ noHeader, runId }) => {
  const { userDetails } = useAppContext();
  const { data = {} } = useProjectOptions();
  const { control, setError, watch, setValue } = useForm();
  const ref = useRef();
  const reminderRef = useRef();
  const { id } = useParams();
  const [viewTestCase, setViewTestCase] = useState(false);
  const [viewReportedBugs, setViewReportedBugs] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editRecord, setEditRecord] = useState(null);
  const [viewTestCaseIndex, setViewTestCaseIndex] = useState(0);
  const [closeTestRun, setCloseTestRun] = useState(false);
  const [startFromReminder, setStartFromReminder] = useState(false);
  const [openAddMenu, setOpenAddMenu] = useState(false);
  const [openTestCaseModal, setOpenTestCaseModal] = useState({ open: false, msg: '' });
  const [newTestCaseModal, setNewTestCaseModal] = useState(false);
  const { toastSuccess, toastError } = useToaster();
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [reportBug, setReportBug] = useState(false);
  const [isHoveringName, setIsHoveringName] = useState({});
  const [testRun, setTestRun] = useState({});
  const [search, setSearch] = useState('');
  const [warning, setWarning] = useState({ open: false, msg: '' });
  const [isReportBug, setIsReportBug] = useState(false);
  const [viewSizes, setViewSizes] = useState(['20%', 'auto']);
  const [testedStatus, setTestedStatus] = useState('');
  const [sortFilters, setSortFilters] = useState({ sortBy: '', sort: '' });

  const { mutateAsync: _closeTestRunHandler, isLoading: _isCloseLoading } = useCloseTestRuns();
  const { mutateAsync: _deleteTestCase, isLoading: _isDeletingTestCase } = useDeleteTestCasesFromRun();
  const { mutateAsync: _deleteBugs, isLoading: _isDeletingBugs } = useDeleteBugsFromRun();
  const { mutateAsync: _addMoreTestCases, isLoading: _isAddingMore } = useAddMoreTestCases();

  const {
    data: _testRunSummary,
    refetch: refetchSummary,
    isLoading: _isLoadingSummary,
  } = useGetTestSummaryById({
    id: noHeader ? runId : id,
  });

  const { data: _userDataById } = useGetUserById(userDetails?.id);
  const { data: _bugOptions = {} } = useBugsFiltersOptions();

  const {
    data: _testRunData,
    refetch,
    isLoading: _isLoading,
  } = useGetTestRunById({
    id: noHeader ? runId : id,
    tested: testedStatus || 'all',
    search,
  });

  const {
    data: _testRunBugsData,
    refetch: refetchRunBugs,
    isLoading: _isRunBugsLoading,
  } = useGetTestRunBugsById({
    id: noHeader ? runId : id,
  });

  const isTimerStarted = _userDataById?.user?.timerStartTime;

  useEffect(() => {
    const { runType, bugs, testCases } = testRun || {};

    if (runType === 'Bugs' && bugs?.length) {
      const sortedData = sortData(bugs, sortFilters.sortBy, sortFilters.sort);

      setTestRun((prev) => {
        if (prev.bugs !== sortedData) {
          return { ...prev, bugs: sortedData };
        }

        return prev;
      });
    } else if (runType === 'Test Cases' && testCases?.length) {
      const sortedData = sortData(testCases, sortFilters.sortBy, sortFilters.sort);

      setTestRun((prev) => {
        if (prev.testCases !== sortedData) {
          return { ...prev, testCases: sortedData };
        }

        return prev;
      });
    }
  }, [sortFilters, testRun]);

  useEffect(() => {
    if (viewTestCase || viewReportedBugs) {
      if (window.innerWidth <= 768) {
        setViewSizes(['0%', '100%']);
      } else {
        setViewSizes(['65%', '35%']);
      }
    } else {
      setViewSizes(['100%', '0%']);
    }
  }, [viewTestCase, viewReportedBugs]);

  useEffect(() => {
    if (activeTab === 1) {
      refetchSummary();
    }
  }, [activeTab, refetchSummary]);

  const testedValue = watch('tested');

  useEffect(() => {
    if (_testRunData?.testRun && !_isEmpty(_testRunData?.testRun)) {
      let values = _pick(_testRunData?.testRun, [
        '_id',
        'runId',
        'name',
        'status',
        'projectId',
        'createdBy',
        'notTestedCount',
        'testedCount',
        'description',
        'priority',
        'dueDate',
        'assignee',
        'updatedAt',
        'createdAt',
        'dueDate',
        'closedDate',
        'testCases',
        'runType',
        'bugs',
      ]);
      values = {
        ...values,
      };
      setTestRun(values);
    }
  }, [_testRunData, testedValue]);

  const closeHandler = useCallback(async () => {
    try {
      const res = await _closeTestRunHandler(noHeader ? runId : id);
      setCloseTestRun(false);
      await refetch();
      toastSuccess(res?.msg);
    } catch (error) {
      setCloseTestRun(false);

      if (error?.msg?.includes('not tested')) {
        setWarning({ open: true, msg: error.msg });
      } else {
        toastError(error, setError);
      }
    }
  }, [_closeTestRunHandler, id, noHeader, refetch, runId, setError, toastError, toastSuccess]);

  const addMoreTestCaseHandler = useCallback(
    async (data) => {
      try {
        const body = {
          bugs: [],
          testcases: data,
        };
        const res = await _addMoreTestCases({ id: testRun?._id, body });
        toastSuccess(res?.msg);
        setOpenTestCaseModal(false);
        refetch();
        refetchSummary();
      } catch (error) {
        console.error('Error adding more test cases:', error);
      }
    },
    [_addMoreTestCases, testRun, toastSuccess, setOpenTestCaseModal, refetchSummary, refetch],
  );

  const deleteHandler = useCallback(
    async (data) => {
      try {
        const body = {
          testCasesToDelete: data,
        };

        const bugBody = {
          bugsToDelete: data,
        };

        const res = await (testRun?.runType === 'Bugs' ? _deleteBugs : _deleteTestCase)({
          id: testRun?._id,
          body: testRun?.runType === 'Bugs' ? bugBody : body,
        });
        toastSuccess(res?.msg);
        setOpenTestCaseModal(false);
        setSelectedRecords([]);
        refetch();
        refetchSummary();
      } catch (error) {
        console.error('Error deleting', error);
      }
    },
    [testRun?.runType, testRun?._id, _deleteBugs, _deleteTestCase, toastSuccess, refetch, refetchSummary],
  );

  const handleReminder = useCallback(() => {
    if (!reminderRef.current && !isTimerStarted && userDetails?.role !== 'Developer') {
      reminderRef.current = true;
      setReminder(true);
    }
  }, [reminderRef, isTimerStarted, userDetails, setReminder]);

  const singleRunData = useMemo(() => {
    if (!testRun?.runType) return [];

    return testRun?.runType === 'Bugs'
      ? columnsBugsData({
          noHeader,
          setViewTestCase,
          isHoveringName,
          reminder,
          runBugs: testRun?.bugs,
          handleReminder,
          setReminder,
          selectedRecords,
          setSelectedRecords,
          setIsHoveringName,
          setViewTestCaseIndex,
        })
      : columnsData({
          setViewTestCase,
          isHoveringName,
          testRuns: testRun?.testCases,
          reminder,
          selectedRecords,
          setSelectedRecords,
          handleReminder,
          setReminder,
          setIsHoveringName,
          setViewTestCaseIndex,
        });
  }, [
    testRun?.runType,
    testRun?.bugs,
    testRun?.testCases,
    noHeader,
    isHoveringName,
    reminder,
    handleReminder,
    selectedRecords,
  ]);

  const bugReportedColumns = useMemo(() => {
    return columnsBugsReportedData({
      noHeader,
      setViewTestCase,
      setViewReportedBugs,
      isHoveringName,
      reminder,
      handleReminder,
      setIsHoveringName,
      setViewTestCaseIndex,
    });
  }, [noHeader, isHoveringName, reminder, handleReminder]);

  const applyFilter = useCallback(() => {
    setTestedStatus(watch('tested')[0]);
  }, [setTestedStatus, watch]);

  const handleIsReportBugCloseClick = useCallback(() => {
    setIsReportBug(false);
  }, [setIsReportBug]);

  const handleSetIsReportBugClick = useCallback(() => {
    setIsReportBug(true);
  }, [setIsReportBug]);

  const onReset = useCallback(() => {
    setValue('tested', '');
    setTestedStatus('');
  }, [setValue, setTestedStatus]);

  const toggleAddMenu = useCallback(() => {
    setOpenAddMenu((prevOpenAddMenu) => !prevOpenAddMenu);
  }, [setOpenAddMenu]);

  const handleDeleteClick = useCallback(() => {
    deleteHandler(selectedRecords);
  }, [deleteHandler, selectedRecords]);

  const handleCloseTestRunClick = useCallback(() => {
    setCloseTestRun(true);
  }, [setCloseTestRun]);

  const handleDrawerClose = useCallback(() => {
    setViewTestCase(false);
    setViewTestCaseIndex(null);
  }, [setViewTestCase, setViewTestCaseIndex]);

  const handleViewTestCaseCloseClick = useCallback(() => {
    setViewTestCase(false);
  }, [setViewTestCase]);

  const handleAddMoreTestCaseHandlerSubmit = useCallback(
    (e) => {
      addMoreTestCaseHandler(e.map((i) => i._id));
    },
    [addMoreTestCaseHandler],
  );

  const handleNewTestCaseModalClose = useCallback(() => {
    setNewTestCaseModal(false);
  }, [setNewTestCaseModal]);

  const clickStartReminderHandler = useCallback(() => {
    setStartFromReminder(true);
    setReminder(false);
  }, [setStartFromReminder, setReminder]);

  const handleSetCloseTestRun = useCallback(() => {
    setWarning({ open: false, msg: '' });
  }, [setWarning]);

  const handleFilterChange = debounce(({ sortBy = '', sort = '' }) => {
    setSortFilters((pre) => ({
      ...pre,
      sortBy,
      sort,
    }));
  }, 1000);

  const menu = useMemo(
    () => [
      {
        title: 'Add Existing Test Case',
        click: () => {
          setOpenTestCaseModal({ open: true, projectId: '' });
        },
      },
      {
        title: 'Add New Test Case',
        click: () => {
          setNewTestCaseModal(true);
        },
      },
    ],
    [setOpenTestCaseModal, setNewTestCaseModal],
  );

  const pages = useMemo(() => {
    const renderProgress = () => (
      <div className={style.infoDivLower}>
        <div className={style.singleDiv}>
          <span className={style.infoHeading}>Progress:</span>
          <MultiColorProgressBar
            readings={[
              testRun?.testedCount && {
                name: 'testedCount',
                value:
                  (testRun.testedCount / (testRun?.runType === 'Bugs' ? testRun?.bugs : testRun?.testCases)?.length) *
                  100,
                color: '#34C369',
                tooltip: `Tested (${testRun.testedCount})`,
              },
              testRun?.notTestedCount && {
                name: 'notTestedCount',
                value:
                  (testRun?.notTestedCount /
                    (testRun?.runType === 'Bugs' ? testRun?.bugs : testRun?.testCases)?.length) *
                  100,
                color: '#F96E6E',
                tooltip: `Not Tested (${testRun?.notTestedCount})`,
              },
            ]}
          />
          <p className={style.infoText}>
            {(testRun?.runType === 'Bugs' ? testRun?.bugs : testRun?.testCases)?.length > 0 &&
              `${testRun.testedCount}/ ${(testRun?.runType === 'Bugs' ? testRun?.bugs : testRun?.testCases)?.length}`}
          </p>
        </div>
      </div>
    );

    const renderOptions = () => (
      <div className={style.options}>
        <div className={style.rightDiv}>
          <FilterChip
            isDisabled={!testedOptions?.length}
            watch={watch}
            applyFilter={applyFilter}
            name={'tested'}
            label={'Tested Status'}
            options={testedOptions}
            paramFilter={testedStatus}
            control={control}
            onReset={onReset}
          />
          <Button text="Report a Bug" handleClick={handleSetIsReportBugClick} />
          {testRun?.runType === 'Test Cases' && (
            <div className={style.addNewBtn} onClick={toggleAddMenu}>
              <span>Add New</span>
              <Icon name={'ArrowDownIcon'} iconClass={openAddMenu ? style.arrowHeadOpen : style.arrowHead} />
              {openAddMenu && (
                <div className={style.addMenuClass}>
                  <Menu menu={menu} />
                </div>
              )}
            </div>
          )}

          <div className={style.imgDiv1}>
            <div className={style.img} role="presentation">
              <Icon name={'MoreInvertIcon'} iconClass={style.iconClass} />
            </div>
          </div>
        </div>
      </div>
    );

    const renderMainContent = () => (
      <div className={style.mainClass}>
        <h6>
          {testRun.runType} ({(testRun?.runType === 'Bugs' ? testRun?.bugs : testRun?.testCases)?.length})
        </h6>
        <div className={style.flex}>
          {' '}
          {selectedRecords.length > 0 ? (
            <div
              id={'deleteButton'}
              className={style.change}
              onClick={handleDeleteClick}
              style={{
                opacity: _isDeletingTestCase || _isDeletingBugs ? '0.5' : '1',
                pointerEvents: _isDeletingTestCase || _isDeletingBugs ? 'none' : '',
              }}
            >
              <div className={style.imgDelMain}>
                <Icon name={'Delete24'} height={24} width={24} />
              </div>
              <div className={style.tooltip}>
                <p>Delete</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );

    const renderTableOrLoader = () => {
      const dataLength = (testRun?.runType === 'Bugs' ? testRun?.bugs : testRun?.testCases)?.length;

      if (_isLoading) {
        return (
          <div className={style.noDataStyle}>
            <Loader />
          </div>
        );
      }

      if (dataLength) {
        return (
          <div className={style.tableWidth}>
            <GenericTable
              ref={ref}
              columns={singleRunData}
              filters={sortFilters}
              onClickHeader={handleFilterChange}
              dataSource={dataLength > 0 ? (testRun?.runType === 'Bugs' ? testRun?.bugs : testRun?.testCases) : []}
              height={noHeader ? 'calc(100vh - 360px)' : 'calc(100vh - 300px)'}
              selectable={true}
              classes={{
                test: style.test,
                table: style.table,
                thead: style.thead,
                th: style.th,
                containerClass: style.checkboxContainer,
                tableBody: style.tableRow,
              }}
            />
          </div>
        );
      }

      return (
        <div className={style.noDataStyle}>
          <img src={noData} alt="" />
        </div>
      );
    };

    const renderBugReportedTable = () => {
      const dataLength = _testRunBugsData?.count;

      if (_isRunBugsLoading) {
        return (
          <div className={style.noDataStyle}>
            <Loader />
          </div>
        );
      }

      if (dataLength) {
        return (
          <div className={style.tableWidth}>
            <GenericTable
              ref={ref}
              columns={bugReportedColumns}
              filters={sortFilters}
              onClickHeader={handleFilterChange}
              dataSource={dataLength > 0 ? _testRunBugsData?.bugs : []}
              height={noHeader ? 'calc(100vh - 360px)' : 'calc(100vh - 300px)'}
              selectable={true}
              classes={{
                test: style.test,
                table: style.table,
                thead: style.thead,
                th: style.th,
                containerClass: style.checkboxContainer,
                tableBody: style.tableRow,
              }}
            />
          </div>
        );
      }

      return (
        <div className={style.noDataStyle}>
          <img src={noData} alt="" />
        </div>
      );
    };

    return [
      {
        id: 0,
        tabTitle: `Run Detailed View `,
        content: (
          <>
            {renderProgress()}
            {renderOptions()}
            {renderMainContent()}
            {renderTableOrLoader()}
            <div className={style?.btnDiv}>
              <Permissions
                allowedRoles={['Admin', 'Project Manager']}
                currentRole={userDetails?.role}
                accessParticular={
                  userDetails?.role === 'QA' &&
                  (userDetails?.id === testRun?.createdBy?._id || userDetails?.id === testRun?.assignee?._id)
                }
              >
                {testRun?.status !== 'Closed' && (
                  <Button text={'Close Run'} handleClick={handleCloseTestRunClick} btnClass={style.backclassbtn} />
                )}
              </Permissions>
            </div>
          </>
        ),
      },
      {
        id: 1,
        tabTitle: `Summary Report `,
        content: (
          <SummaryContent
            runId={noHeader ? runId : id}
            isLoading={_isLoadingSummary}
            summaryData={_testRunSummary?.data || {}}
          />
        ),
      },
      {
        id: 2,
        tabTitle: `Bugs Reported `,
        content: (
          <>
            <p className={style.reportedBugsTopP}>This is the list of bugs reported in this test run.</p>
            <div className={style.mainClass}>
              <h6>Reported Bugs ({_testRunBugsData?.count || 0})</h6>
            </div>
            {renderBugReportedTable()}
          </>
        ),
      },
    ];
  }, [
    userDetails?.role,
    userDetails?.id,
    testRun?.createdBy?._id,
    testRun?.assignee?._id,
    testRun?.status,
    testRun.testedCount,
    testRun.runType,
    testRun?.bugs,
    testRun?.testCases,
    testRun?.notTestedCount,
    handleCloseTestRunClick,
    noHeader,
    runId,
    id,
    _isLoadingSummary,
    _testRunSummary?.data,
    _testRunBugsData?.count,
    _testRunBugsData?.bugs,
    watch,
    applyFilter,
    testedStatus,
    control,
    onReset,
    handleSetIsReportBugClick,
    toggleAddMenu,
    openAddMenu,
    menu,
    selectedRecords.length,
    handleDeleteClick,
    _isDeletingTestCase,
    _isDeletingBugs,
    _isLoading,
    singleRunData,
    sortFilters,
    handleFilterChange,
    _isRunBugsLoading,
    bugReportedColumns,
  ]);

  return (
    <>
      <div className={style.topClass}>
        <SplitPane sizes={viewSizes} onChange={setViewSizes} allowResize={viewTestCase}>
          <MainWrapper
            title="Test Run"
            date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
            searchField
            onSearch={_debounce((e) => {
              setSearch(e.target.value);
            }, 1000)}
            onClear={_debounce(() => {
              setSearch('');
            }, 1000)}
            stylesBack={noHeader ? { marginTop: '10px' } : {}}
            noHeader={noHeader}
          >
            {_isLoading ? (
              <Loader />
            ) : (
              <>
                <div className={style.pathDiv}>
                  <Link to="/test-run">
                    <span className={style.grey}> {testRun?.runType} Run </span>
                  </Link>
                  <img src={right} height={14} width={14} alt="" />
                  <span className={style.blue}>
                    {testRun?.name} ({formattedDate(testRun?.createdAt, 'MMM d')}) - {testRun?.runId}
                  </span>
                </div>
                <div className={style.descriptionDiv}>
                  <span className={style.descriptionHeading}> Description: </span>
                  <p className={style.description}>{testRun?.description}</p>
                </div>
                <div className={style.infoDiv}>
                  <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                    <div>
                      <TimeTracker
                        startFromReminder={startFromReminder}
                        setStartFromReminder={setStartFromReminder}
                        runId={noHeader ? runId : id}
                        handleDrawerClose={handleDrawerClose}
                      />
                    </div>
                  </Permissions>
                  <div className={style.infoInner}>
                    <span className={style.infoHeading}>Priority:</span>
                    <p className={style.infoText}>{testRun?.priority}</p>
                  </div>
                  <div className={style.infoInner}>
                    <span className={style.infoHeading}>Due Date:</span>
                    <p className={style.infoText}>{formattedDate(testRun?.dueDate, 'd MMM, yyyy')}</p>
                  </div>
                  <div className={style.infoInner}>
                    <span className={style.infoHeading}>Assignee:</span>
                    <p className={style.infoText}>{testRun?.assignee?.name}</p>
                  </div>
                </div>

                <Tabs pages={pages} activeTab={activeTab} setActiveTab={setActiveTab} customClass={style.tabsClass} />
              </>
            )}
          </MainWrapper>
          <div className={style.flex1}>
            {viewTestCase && !reportBug && testRun?.runType === 'Test Cases' && (
              <div className={style.flex1}>
                <ViewTestCase
                  setDrawerOpen={setViewTestCase}
                  viewTestCase={viewTestCase}
                  setViewTestCaseIndex={setViewTestCaseIndex}
                  viewTestCaseIndex={viewTestCaseIndex}
                  allData={testRun?.testCases}
                  testRunId={noHeader ? runId : id}
                  noHeader={noHeader}
                  testRunStatus={true}
                  setReportBug={setReportBug}
                  setEditRecord={setEditRecord}
                  editRecord={editRecord}
                  refetchAll={refetch}
                  accessParticular={
                    userDetails?.role === 'QA' &&
                    (userDetails?.id === testRun?.createdBy?._id || userDetails?.id === testRun?.assignee?._id)
                  }
                  evidenceRequired={_testRunData?.testRun?.evidenceRequired || false}
                />
              </div>
            )}

            {viewTestCase && !reportBug && testRun?.runType === 'Bugs' && (
              <div className={style.flex1}>
                <ViewBug
                  setDrawerOpen={setViewTestCase}
                  viewBug={viewTestCase}
                  setViewBugIndex={setViewTestCaseIndex}
                  viewBugIndex={viewTestCaseIndex}
                  allData={testRun?.bugs}
                  testRunId={noHeader ? runId : id}
                  noHeader={noHeader}
                  testRunStatus={true}
                  setReportBug={setReportBug}
                  setEditRecord={setEditRecord}
                  refetchAll={refetch}
                  accessParticular={
                    userDetails?.role === 'QA' &&
                    (userDetails?.id === testRun?.createdBy?._id || userDetails?.id === testRun?.assignee?._id)
                  }
                  evidenceRequired={_testRunData?.testRun?.evidenceRequired || false}
                  _bugOptions={_bugOptions}
                />
              </div>
            )}

            {viewReportedBugs && !reportBug && (
              <div className={style.flex1}>
                <ViewBug
                  viewReportedBugs
                  setDrawerOpen={setViewReportedBugs}
                  setViewBugIndex={setViewTestCaseIndex}
                  viewBugIndex={viewTestCaseIndex}
                  allData={_testRunBugsData?.bugs}
                  testRunId={noHeader ? runId : id}
                  noHeader={noHeader}
                  testRunStatus={true}
                  setReportBug={setReportBug}
                  setEditRecord={setEditRecord}
                  refetchAll={refetch}
                  _bugOptions={_bugOptions}
                />
              </div>
            )}

            {viewTestCase && <div id="splitpane" className={style.splitPane} onClick={handleViewTestCaseCloseClick} />}
          </div>
        </SplitPane>
      </div>

      {openTestCaseModal?.open && (
        <SelectTestCases
          openAddModal={openTestCaseModal?.open}
          setOpenAddModal={setOpenTestCaseModal}
          projectId={testRun?.projectId}
          options={data}
          type={'Test Cases'}
          addNew={testRun?.projectId}
          editRecords={[]}
          isAddingNew={_isAddingMore}
          onDiscard={refetch}
          onSubmit={handleAddMoreTestCaseHandlerSubmit}
        />
      )}

      {newTestCaseModal && (
        <AddTestCaseModal
          open={newTestCaseModal}
          handleClose={handleNewTestCaseModalClose}
          setNewTestCaseModal={setNewTestCaseModal}
          projectId={testRun?.projectId}
          relatedRunId={testRun?._id}
          refetchTestRun={refetch}
        />
      )}
      <GenericModal
        modalClass={style.reminderModal}
        openModal={reminder && !isTimerStarted}
        setOpenModal={setReminder}
        mainIcon={<Icon name={'StartTimer'} height={100} width={80} />}
        modalTitle={'Do you want to track time?'}
        cancelText={'No, Discard'}
        saveText={'Start Timer'}
        btnDivClass={style.btnDivClass}
        clickHandler={clickStartReminderHandler}
      />

      {isReportBug && (
        <StartTestingModal
          refetchRun={refetch}
          open={isReportBug}
          handleClose={handleIsReportBugCloseClick}
          projectId={testRun?.projectId}
          relatedRunId={testRun?._id}
          refetchReportedBugs={refetchRunBugs}
        />
      )}

      <CloseTestRun
        closeTestRun={closeTestRun}
        setCloseTestRun={setCloseTestRun}
        clickHandler={closeHandler}
        _isCloseLoading={_isCloseLoading}
      />

      <WarningTestRun closeTestRun={warning?.open} setCloseTestRun={handleSetCloseTestRun} msg={warning?.msg} />
      {openAddMenu && <div className={style.backdropDiv} onClick={toggleAddMenu}></div>}
    </>
  );
};

TestRunSingle.propTypes = {
  noHeader: PropTypes.bool.isRequired,
  runId: PropTypes.string.isRequired,
};

export default TestRunSingle;

const testedOptions = [
  { label: 'Tested', value: 'tested', checkbox: true },
  { label: 'Not Tested', value: 'not-tested', checkbox: true },
];
