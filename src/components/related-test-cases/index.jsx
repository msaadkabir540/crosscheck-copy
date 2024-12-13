import { useCallback, useEffect, useRef, useState } from 'react';

import { debounce } from 'lodash';

import { useAppContext } from 'context/app-context';

import { initialFilter as testCasesFilters } from 'pages/test-cases/helper';

import Loader from 'components/loader';
import Highlighter from 'components/highlighter';
import Tags from 'components/tags';
import GenericTable from 'components/generic-table';
import ReportBugModal from 'components/report-bug-modal';

import { useToaster } from 'hooks/use-toaster';

import { useUpdateStatusTestCase, useGetTestCasesByFilter, useUpdateOrderTestCase } from 'api/v1/test-cases/test-cases';

import { pickBy as _pickBy } from 'utils/lodash';
import { formattedDate } from 'utils/date-handler';

import noData from 'assets/no-found.svg';

import TestCaseCard from './test-case-card';
import style from './drawer.module.scss';
import ThemedIcon from '../icon/themed-icon';

const Drawer = ({
  handleClose,
  setTestCaseId,
  testCaseId,
  newBugId,
  setCount,
  tableView,
  projectId,
  mileStoneId,
  featureId,
  taskId,
  key,
}) => {
  const testCasesRef = useRef(null);

  const { userDetails } = useAppContext();
  const { toastError, toastSuccess } = useToaster();
  const [bugModal, setBugModal] = useState('');
  const [testCasesPage, setTestCasePage] = useState(1);
  const [testCases, setTestCases] = useState({});
  const [sortFilters, setSortFilters] = useState({ sort: '', sortBy: '' });

  const { mutateAsync: _getAllTestCases, isLoading: _isLoading } = useGetTestCasesByFilter();

  const { mutateAsync: _updateStatusHandler, isLoading: _isStatusUpdateLoading } = useUpdateStatusTestCase();

  const refetch = useCallback(
    (id, status) => {
      const index = testCases.testcases.findIndex((x) => x._id === id);
      const newTestCases = testCases.testcases;
      newTestCases[index].status = status;
      setTestCases((pre) => ({
        ...(pre || {}),

        testcases: newTestCases,
      }));
    },
    [testCases],
  );

  const fetchTestCases = useCallback(
    async (filters) => {
      try {
        const res = await _getAllTestCases({ ...filters, ...sortFilters });
        setTestCases((pre) => ({
          ...(pre || {}),
          count: res?.count || 0,
          testcases: [...(pre.testcases || []), ...(res?.testcases || [])],
        }));
      } catch (error) {
        toastError(error);
      }
    },
    [toastError, _getAllTestCases, sortFilters],
  );

  const statusChangeHandler = useCallback(
    async (id, testStatus, relatedBug) => {
      try {
        const body = { testStatus, source: 'Test Case' };

        if (relatedBug) {
          body.relatedBug = relatedBug;
        }

        const res = await _updateStatusHandler({ id, body });

        toastSuccess(res.msg);
        !testCaseId && refetch(id, testStatus);
        testCaseId && handleClose();
        setBugModal('');
      } catch (error) {
        toastError(error);
      }
    },
    [handleClose, testCaseId, toastError, toastSuccess, _updateStatusHandler, refetch],
  );

  const handleFilterChange = debounce(({ sortBy = '', sort = '' }) => {
    setSortFilters((pre) => ({ ...pre, sortBy, sort }));
  }, 1000);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = testCasesRef.current;

    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (testCases?.count !== testCases?.testcases.length && !_isLoading) {
        testCasesRef?.current?.removeEventListener('scroll', handleScroll);
        setTestCasePage((prev) => prev + 1);
        // NOTE: Scroll up by 10 pixels from the last scroll position
        testCasesRef.current.scrollTo(scrollLeft, scrollTop - 10);
      }
    }
  }, [_isLoading, testCases]);

  useEffect(() => {
    const testCasesRefContainer = testCasesRef?.current;

    if (!_isLoading) {
      testCasesRefContainer?.addEventListener('scroll', handleScroll);
    } else if (_isLoading) {
      testCasesRefContainer?.removeEventListener('scroll', handleScroll);
    }

    return () => {
      testCasesRefContainer?.removeEventListener('scroll', handleScroll);
    };
  }, [testCasesRef, testCases, _isLoading, handleScroll]);

  useEffect(() => {
    if (newBugId) {
      statusChangeHandler(testCaseId, 'Failed', newBugId);
    }
  }, [newBugId, testCaseId, statusChangeHandler]);

  useEffect(() => {
    setTestCasePage(1);
    setTestCases({});
  }, [featureId]);

  useEffect(() => {
    setCount && setCount(testCases?.count);
  }, [testCases, setCount]);

  useEffect(() => {
    if (projectId && mileStoneId && featureId) {
      fetchTestCases(
        (projectId && mileStoneId && featureId) || taskId
          ? {
              ..._pickBy(testCasesFilters, (value, key) => {
                if (key === 'createdAt' || key === 'lastTestedAt') {
                  return !(value.start === null);
                }

                return true;
              }),
              ...(projectId &&
                mileStoneId &&
                typeof mileStoneId === 'string' &&
                featureId &&
                typeof featureId === 'string' && {
                  projects: [projectId],
                  milestones: [mileStoneId],
                  features: [featureId],
                }),
              page: testCasesPage,
              ...(taskId && {
                relatedTicketId: taskId,
              }),
            }
          : _pickBy(testCasesFilters, (value, key) => {
              if (key === 'createdAt' || key === 'lastTestedAt') {
                return !(value.start === null);
              }

              return true;
            }),
      );
    }
  }, [featureId, testCasesPage, mileStoneId, projectId, taskId, sortFilters, fetchTestCases]);

  const { mutateAsync: _updateOrderHandler } = useUpdateOrderTestCase();

  const onOrderUpdate = useCallback(
    async (e) => {
      try {
        const id = testCases?.testcases[e?.source?.index]?._id;

        const body = {
          newOrder: e?.destination?.index,
        };

        const res = await _updateOrderHandler({ id, body });
        toastSuccess(res.msg);
      } catch (error) {
        toastError(error);
      }
    },
    [_updateOrderHandler, testCases, toastError, toastSuccess],
  );

  const handleTestCaseId = useCallback(
    (id) => {
      setTestCaseId(id);
      setBugModal('');
    },
    [setTestCaseId],
  );

  const handleOpenDelModal = useCallback(async () => {
    setBugModal('');
  }, []);

  const closeHandler = useCallback(
    async () => await statusChangeHandler(bugModal, 'Failed', ''),
    [bugModal, statusChangeHandler],
  );
  const clickHandler = useCallback(async () => handleTestCaseId(bugModal), [bugModal, handleTestCaseId]);

  return (
    <>
      <div key={key} className={style.main}>
        {_isLoading && testCasesPage < 2 ? (
          <Loader />
        ) : testCases.testcases?.length ? (
          !tableView ? (
            <div className={style.body}>
              <div className={style.mainMain}>
                <p className={style.testCases}>
                  Test Cases(
                  {testCases?.testcases?.filter((x) => x.status === 'Passed')?.length}/{testCases?.count})
                </p>
                <div className={style.div} />
                <div className={style.passFail}>
                  <p>Pass</p>
                  <h6>{testCases?.testcases?.filter((x) => x.status === 'Passed')?.length}</h6>
                  <div className={style.passClass} />
                  <p>Fail</p>
                  <h6 className={style.failClass}>
                    {testCases?.testcases?.filter((x) => x.status === 'Failed')?.length}
                  </h6>{' '}
                  <div className={style.passClass} />
                  <p>Block</p>
                  <h6 className={style.redClass}>
                    {testCases?.testcases?.filter((x) => x.status === 'Blocked')?.length}
                  </h6>
                </div>
              </div>
              <div ref={testCasesRef} className={style.height}>
                {testCases?.testcases.map((ele) => (
                  <TestCaseCard
                    key={ele?._id}
                    data={ele}
                    setBugModal={setBugModal}
                    onStatusChange={statusChangeHandler}
                  />
                ))}
              </div>
              {_isLoading && <Loader tableMode />}
            </div>
          ) : (
            <GenericTable
              filters={sortFilters}
              onClickHeader={handleFilterChange}
              ref={testCasesRef}
              columns={columnsData({})}
              dataSource={testCases?.testcases || []}
              height={'calc(100vh - 275px)'}
              selectable={true}
              draggable={true}
              dragIconClass={style.dragIconClass}
              onDragUpdate={onOrderUpdate}
              classes={{
                table: style.table,
                thead: style.thead,
                th: style.th,
                containerClass: style.checkboxContainer,
                tableBody: style.tableRow,
              }}
            />
          )
        ) : (
          <div className={style.noDataClass}>
            <img src={noData} alt="no-data" />
          </div>
        )}
      </div>
      <ReportBugModal
        btnType="button"
        isStatusUpdating={_isStatusUpdateLoading}
        openDelModal={bugModal}
        setOpenDelModal={handleOpenDelModal}
        closeHandler={closeHandler}
        clickHandler={clickHandler}
        locked={userDetails?.activePlan === 'Free'}
      />
    </>
  );
};

export default Drawer;

const columnsData = ({ searchedText }) => [
  {
    name: 'Test Case ID',
    key: 'testCaseId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div className={`${style.imgDiv} ${style.tcIdClass}`} data-cy={`testcase-table-id${row?.index}`}>
          <ThemedIcon name={'Drag'} />
          <p className={style.userName}>
            <Highlighter search={searchedText}>{row?.testCaseId}</Highlighter>
          </p>
        </div>
      );
    },
  },
  {
    name: 'Project',
    key: 'projectId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv} data-cy={`addtestcase-row-table${row?.index}`}>
          <p className={style.userName}>
            <Highlighter search={searchedText}>{row?.projectId?.name}</Highlighter>
          </p>
        </div>
      );
    },
  },
  {
    name: 'Milestone',
    key: 'milestoneId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '100px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.milestoneId?.name}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Feature',
    key: 'featureId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.featureId?.name}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Test Type',
    key: 'testType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.testType}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Test Objective',
    key: 'testObjective.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.testObjective?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Pre Conditions',
    key: 'preConditions.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.preConditions?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Test Steps',
    key: 'testSteps.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.testSteps?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Expected Results',
    key: 'expectedResults.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.expectedResults?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Weightage',
    key: 'weightage',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '110px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.weightage}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Status',
    key: 'status',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Tags
            text={row.status}
            colorScheme={{
              Failed: '#F96E6E',
              Passed: '#34C369',
              Blocked: '#F80101',
              'Not Tested': '#656F7D',
            }}
          />
        </p>
      </div>
    ),
  },
  {
    name: 'State',
    key: 'state',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.state}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Related Ticket ID',
    key: 'relatedTicketId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.relatedTicketId}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Last Tested at',
    key: 'lastTestedAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row?.lastTestedAt, 'dd MMM,yyyy')}</p>
      </div>
    ),
  },
  {
    name: 'Last Tested by',
    key: 'lastTestedBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv}>
          <p className={`${style.userName} ${style.pointerClass}`}>{row?.lastTestedBy?.name ?? '-'}</p>
        </div>
      );
    },
  },
  {
    name: 'Created at',
    key: 'createdAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '115px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row.createdAt, 'dd MMM,yyyy')}</p>
      </div>
    ),
  },
  {
    name: 'Created by',
    key: 'createdBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv}>
          <p className={`${style.userName} ${style.pointerClass}`}>{row?.createdBy?.name ?? '-'}</p>
        </div>
      );
    },
  },
];
