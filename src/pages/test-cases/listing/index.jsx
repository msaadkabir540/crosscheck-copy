import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import _ from 'lodash';

import { useAppContext } from 'context/app-context';

import DrawerForRun from 'pages/test-runs/drawer';

import MainWrapper from 'components/layout/main-wrapper';
import BulkEditModal from 'components/bulk-edit-modal';
import Button from 'components/button';
import GenericTable from 'components/generic-table';
import DeleteModal from 'components/delete-modal';
import Loader from 'components/loader';
import CreateTaskModal from 'components/create-task-modal';
import Permissions from 'components/permissions';
import TextField from 'components/text-field';
import FilterChip from 'components/filter-chip';
import MobileMenu from 'components/mobile-menu';
import ReportBugModal from 'components/report-bug-modal';
import SplitPane from 'components/split-pane/split-pane';

import { useToaster } from 'hooks/use-toaster';

import {
  useBulkEditTestCase,
  useDeleteTestCase,
  useExportTestCases,
  useGetTestCasesByFilter,
  useUpdateStatusTestCase,
  useGetTestCaseById,
} from 'api/v1/test-cases/test-cases';
import { useGetTags } from 'api/v1/custom-tags/custom-tags';
import { useCreateJiraTask, useCreateTask } from 'api/v1/task/task';
import { useCreateTestRun } from 'api/v1/test-runs/test-runs';

import { downloadCSV } from 'utils/file-handler';
import { formattedDate } from 'utils/date-handler';
import { debounce, every, pick, pickBy } from 'utils/lodash';

import run from 'assets/CreateRun.svg';
import clearIcon from 'assets/cross.svg';
import noData from 'assets/no-found.svg';
import deleteBtn from 'assets/deleteButton.svg';

import { columnsData, initialFilter, menuData, useProjectOptions } from '../helper';
import StartTestingModal from '../start-reporting-bugs';
import AddTestCase from '../add-test-case/index';
import FiltersDrawer from '../filters-drawer';
import Icon from '../../../components/icon/themed-icon';
import ViewTestCases from '../view-test-cases';
import FilterHeader from '../header';
import { copyTestCaseToClipboard } from './helper';
import style from '../test.module.scss';
import StatusUpdateModel from '../status-update-model';

const filterNames = [
  'search',
  'projects',
  'milestones',
  'features',
  'status',
  'createdBy',
  'state',
  'lastTestedBy',
  'weightage',
  'tags',
  'assignedTo',
  'testType',
  'page',
  'perPage',
  'createdAt',
  'lastTestedAt',
];

const TestCases = ({ noHeader, projectId, setIsImportActive }) => {
  const containerRef = useRef(null);
  const { data = {}, refetch: refetchData } = useProjectOptions();

  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersParams, setFiltersParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [statusUpdateTestCaseId, setStatusUpdateTestCaseId] = useState();
  const { control, watch, register, reset, setValue } = useForm();

  const testCaseId = searchParams.get('testCaseId');

  const [editRecord, setEditRecord] = useState(null);
  const [menu, setMenu] = useState(false);
  const [duplicateRecord, setDuplicateRecord] = useState(null);
  const [isAddTestCase, setIsAddTestCase] = useState({ open: false });

  const [selectedRecords, setSelectedRecords] = useState([]);
  const [selectedRunRecords, setSelectedRunRecords] = useState([]);
  const [delModal, setDelModal] = useState(false);
  const [viewTestCase, setViewTestCase] = useState(false);
  const [viewTestRun, setViewTestRun] = useState(false);
  const [allowFilterDrawer, setAllowFilterDrawer] = useState(false);

  const [bulkEdit, setBulkEdit] = useState(false);
  const [moreMenu, setMoreMenu] = useState(false);

  const [reportBug, setReportBug] = useState(false);
  const [selectedBugs, setSelectedBugs] = useState([]);
  const [open, setOpen] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [stopDrag, setStopDrag] = useState(false);
  const [viewTestCaseId, setViewTestCaseId] = useState('');
  const { userDetails } = useAppContext();
  const [rightClickedRecord, setRightClickedRecord] = useState({});
  const [isHoveringName, setIsHoveringName] = useState({});

  const [bugModal, setBugModal] = useState(false);
  const [isReportBug, setIsReportBug] = useState({ open: false });

  const { toastSuccess, toastError } = useToaster();
  const [filtersCount, setFiltersCount] = useState(0);

  const [filters, setFilters] = useState({
    ...initialFilter,
    projects: projectId ? [projectId] : [],
  });
  const [sizes, setSizes] = useState(['20%', 'auto']);

  const { mutateAsync: _getAllTestCases, isLoading: _isLoading } = useGetTestCasesByFilter();
  const { mutateAsync: _exportTestCases } = useExportTestCases();
  const { mutateAsync: _deleteTestCaseHandler, isLoading: _isDeleteLoading } = useDeleteTestCase();

  //NOTE: Need to Move to Other Folder
  const { mutateAsync: _createTaskHandler, isLoading: _createTaskIsLoading } = useCreateTask();
  const { mutateAsync: _createTestRunHandler, isLoading: _createRunIsLoading } = useCreateTestRun();
  const { mutateAsync: _createJiraTaskHandler, isLoading: _createJiraTaskIsLoading } = useCreateJiraTask();
  const { mutateAsync: _bulkEditHandler, isLoading: _isBulkEditLoading } = useBulkEditTestCase();
  const { mutateAsync: _updateStatusTestCase, isLoading: _isStatusUpdating } = useUpdateStatusTestCase();
  const { data: _testCaseData = {}, refetch } = useGetTestCaseById(viewTestCaseId);

  useEffect(() => {
    if (viewTestCase || viewTestRun) {
      if (window.innerWidth <= 768) {
        setSizes(['0%', '100%']);
      } else {
        setSizes(['65%', '35%']);
      }
    } else {
      setSizes(['100%', '0%']);
    }
  }, [viewTestCase, viewTestRun]);

  const [sortFilters, setSortFilters] = useState({
    sortBy: '',
    sort: '',
  });
  const [testCases, setTestCases] = useState({});

  const paramFilters = useMemo(() => {
    const result = {};

    for (const paramName of filterNames) {
      if (paramName === 'search') {
        result[paramName] = filtersParams?.get(paramName) || '';
      } else if (['createdAt', 'lastTestedAt', 'reTestDate']?.includes(paramName)) {
        result[paramName] = {
          start: filtersParams?.get(`${paramName}.start`) || null,
          end: filtersParams?.get(`${paramName}.end`) || null,
        };
      } else {
        result[paramName] = filtersParams?.getAll(paramName) || [];
      }
    }

    return {
      ...result,
      search: filters?.search,
      createdAt: result?.createdAt || { start: null, end: null },
      lastTestedAt: result?.lastTestedAt || { start: null, end: null },
      reTestDate: result?.reTestDate || { start: null, end: null },
      relatedTicketId: '',
      page: filters?.page,
      perPage: 25,
    };
  }, [filtersParams, filters?.page, filters?.search]);

  const optionMenu = [
    ...(userDetails?.role !== 'Developer'
      ? [
          {
            bodyData: [
              {
                click: (e) => {
                  e.preventDefault();
                  setIsAddTestCase({ open: true });
                  setEditRecord({ id: rightClickedRecord?._id });
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
                  id: rightClickedRecord._id,
                  body: { testStatus: 'Passed', source: 'Test Case' },
                });
                toastSuccess(res?.msg);
                refetchHandler(rightClickedRecord._id, 'edit', res?.testCaseData);
              },
            },
            {
              subText: 'Failed',
              optionClick: async function () {
                const res = await _updateStatusTestCase({
                  id: rightClickedRecord._id,
                  body: { testStatus: 'Failed', source: 'Test Case' },
                });
                toastSuccess(res?.msg);
                refetchHandler(rightClickedRecord._id, 'edit', res?.testCaseData);
              },
            },
            {
              subText: 'Blocked',
              optionClick: async function () {
                const res = await _updateStatusTestCase({
                  id: rightClickedRecord._id,
                  body: { testStatus: 'Blocked', source: 'Test Case' },
                });
                toastSuccess(res?.msg);
                refetchHandler(rightClickedRecord._id, 'edit', res?.testCaseData);
              },
            },
            {
              subText: 'Not Tested',
              optionClick: async function () {
                const res = await _updateStatusTestCase({
                  id: rightClickedRecord._id,
                  body: { testStatus: 'Not Tested', source: 'Test Case' },
                });
                toastSuccess(res?.msg);
                refetchHandler(rightClickedRecord._id, 'edit', res?.testCaseData);
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
            setDuplicateRecord({ id: rightClickedRecord?._id });
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
          click: () => copyTestCaseToClipboard(rightClickedRecord),
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
              : (setSelectedBugs((prev) => [...prev, rightClickedRecord]),
                setSelectedRecords((pre) =>
                  pre.includes(rightClickedRecord._id)
                    ? pre.filter((x) => x !== rightClickedRecord._id)
                    : [...pre, rightClickedRecord._id],
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
          click: () =>
            selectedRunRecords.length > 1
              ? every(
                  selectedRunRecords,
                  (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                ) && setViewTestRun(true)
              : (setSelectedRunRecords((prev) => [...prev, rightClickedRecord]), setViewTestRun(true)),
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
                    name: rightClickedRecord?.testCaseId,
                    id: rightClickedRecord?._id,
                  }),
                icon: <Icon name={'DelIcon'} iconClass={style.editColor1} />,
                text: 'Delete',
              },
            ],
          },
        ]
      : []),
  ];

  const { data: _tagsData } = useGetTags({
    id: projectId || watch('projects'),
  });
  const { testCase = {} } = _testCaseData;

  const tagsOptions = useMemo(() => {
    return (
      _tagsData?.tags?.map((x) => ({
        label: x.name,
        value: x._id,
        checkbox: true,
      })) || []
    );
  }, [_tagsData?.tags]);

  useEffect(() => {
    if (testCase && !_.isEmpty(testCase)) {
      setValue('testStatus', testCase?.status);
    }
  }, [testCase, setValue]);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = containerRef.current;

    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (testCases.count !== testCases?.testcases?.length && !_isLoading) {
        containerRef?.current?.removeEventListener('scroll', handleScroll);

        setFilters((prev) => ({
          ...prev,
          page: !_isLoading && prev?.page + 1,
          projects: projectId ? [projectId] : [],
        }));

        // NOTE: Scroll up by 10 pixels from the last scroll position
        containerRef.current.scrollTo(scrollLeft, scrollTop - 10);
      }
    }
  }, [_isLoading, projectId, testCases?.count, testCases?.testcases?.length]);

  useEffect(() => {
    const CONTAINERREF_CURRENT = containerRef?.current;

    if (!_isLoading) {
      CONTAINERREF_CURRENT?.addEventListener('scroll', handleScroll);
    } else if (_isLoading) {
      CONTAINERREF_CURRENT?.removeEventListener('scroll', handleScroll);
    }

    return () => {
      CONTAINERREF_CURRENT?.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, testCases, _isLoading, handleScroll]);

  useEffect(() => {
    const _values = pick(Object.fromEntries([...searchParams]), [
      'reportedBy',
      'reportedAtStart',
      'reportedAtEnd',
      'retestDateStart',
      'retestDateEnd',
      'status',
    ]);

    if (_values.reportedBy) {
      _values.createdBy = _values?.reportedBy?.split(',') || [];
    }

    if (_values.status) {
      _values.status = _values?.status?.split(',') || [];
    }

    if (_values?.reportedAtStart && _values?.reportedAtEnd) {
      _values.createdAt = {
        start: new Date(_values?.reportedAtStart),
        end: new Date(_values?.reportedAtEnd),
      };
    }

    if (_values?.retestDateStart && _values?.retestDateEnd) {
      _values.lastTestedAt = {
        start: new Date(_values?.retestDateStart),
        end: new Date(_values?.retestDateEnd),
      };
    }

    delete _values.reportedBy;
    delete _values.reportedAtStart;
    delete _values.reportedAtEnd;
    delete _values.retestDateStart;
    delete _values.retestDateStart;

    Object.entries(_values).forEach(([key, val]) => {
      setValue(key, val);
    });
  }, [searchParams, setValue]);

  // NOTE: fetching TextCases
  const fetchTestCases = useCallback(
    async (filters) => {
      try {
        const response = await _getAllTestCases(
          pickBy(filters, (value, key) => {
            if (key === 'createdAt' || key === 'lastTestedAt') {
              return !(value.start === null);
            }

            return true;
          }),
        );
        setTestCases((pre) => ({
          ...(pre || {}),
          count: response.count || 0,
          testcases: filters?.page === 1 ? response?.testcases : [...(pre.testcases || []), ...response.testcases],
        }));
      } catch (error) {
        toastError(error);
      }
    },
    [_getAllTestCases, toastError],
  );

  useEffect(() => {
    !_isLoading &&
      fetchTestCases(
        projectId
          ? paramFilters
            ? {
                ...paramFilters,
                ...(watch('search') && { search: watch('search') }),
                projects: [projectId],
                ...sortFilters,
              }
            : { ...filters, ...(watch('search') && { search: watch('search') }), projects: [projectId], ...sortFilters }
          : paramFilters
            ? { ...paramFilters, ...(watch('search') && { search: watch('search') }), ...sortFilters }
            : {
                ...filters,
                ...sortFilters,
                ...(watch('search') && { search: watch('search') }),
                ...(watch('createdBy') && { createdBy: watch('createdBy') }),
                ...(watch('status') && { status: watch('status') }),
                ...(watch('state') && { state: watch('state') }),
                ...(watch('tags') && { tags: watch('tags') }),
                ...(watch('assignedTo') && { assignedTo: watch('assignedTo') }),
                ...(watch('createdAt.start') &&
                  watch('createdAt.end') && {
                    createdAt: {
                      start: formattedDate(watch('createdAt.start'), 'yyyy-MM-dd'),
                      end: formattedDate(watch('createdAt.end'), 'yyyy-MM-dd'),
                    },
                  }),

                ...(watch('lastTestedAt.start') &&
                  watch('lastTestedAt.end') && {
                    lastTestedAt: {
                      start: formattedDate(watch('lastTestedAt.start'), 'yyyy-MM-dd'),
                      end: formattedDate(watch('lastTestedAt.end'), 'yyyy-MM-dd'),
                    },
                  }),
              },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortFilters]);

  const handleResetFilters = useCallback(() => {
    reset({ ...initialFilter });
    setFilters(() => ({ ...initialFilter, projects: projectId ? [projectId] : [] }));
    setTestCases({
      count: 0,
      testcases: [],
    });
    setSortFilters({ sortBy: '', sort: '' });
    setFiltersCount(0);
    setFiltersParams({});
  }, [projectId, reset, setFiltersParams]);

  useEffect(() => {
    if (projectId) {
      setTestCases({
        count: 0,
        testcases: [],
      });
      setFilters((pre) => ({
        ...pre,
        projects: projectId ? [projectId] : [],
      }));
    }
  }, [projectId, handleResetFilters]);

  // NOTE: URLWork
  useEffect(() => {
    if (testCaseId) {
      setViewTestCaseId(testCaseId);
      setViewTestCase(true);
    } else {
      setViewTestCaseId('');
      setViewTestCase(false);
    }
  }, [testCaseId]);

  const countAppliedFilters = () => {
    let count = 0;

    if (watch('projects')?.length > 0 && !noHeader) {
      count++;
    }

    if (watch('milestones')?.length > 0) {
      count++;
    }

    if (watch('features')?.length > 0) {
      count++;
    }

    if (watch('status')?.length > 0) {
      count++;
    }

    if (watch('createdBy')?.length > 0) {
      count++;
    }

    if (watch('tags')?.length > 0) {
      count++;
    }

    if (watch('assignedTo')?.length > 0) {
      count++;
    }

    if (watch('createdAt')?.start !== undefined && watch('createdAt')?.start !== null) {
      count++;
    }

    if (watch('lastTestedAt')?.start !== undefined && watch('lastTestedAt')?.start !== null) {
      count++;
    }

    if (watch('lastTestedBy')?.length > 0) {
      count++;
    }

    if (watch('testType')?.length > 0) {
      count++;
    }

    if (watch('weightage')?.length > 0) {
      count++;
    }

    if (watch('state')?.length > 0) {
      count++;
    }

    if (watch('relatedTicketId')?.length > 0) {
      count++;
    }

    return setFiltersCount(count);
  };

  // NOTE: get users on frontend as per search query
  const handleFilterChange = debounce(({ sortBy = '', sort = '' }) => {
    setFilters((pre) => ({ ...pre, page: 1 }));
    setSortFilters((pre) => ({
      ...pre,
      sortBy,
      sort,
    }));
  }, 1000);

  const exportHandler = useCallback(async () => {
    try {
      const res = await _exportTestCases(
        pickBy(
          {
            ...filters,
            page: 0,
          },
          (value, key) => {
            if (key === 'createdAt' || key === 'lastTestedAt') {
              return !(value.start === null);
            }

            return true;
          },
        ),
      );

      if (res) {
        downloadCSV(res, `TestCases Export File ${new Date()}`);
      }

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }, [_exportTestCases, filters]);

  // NOTE: RefetchHandlerTask
  const refetchHandler = useCallback(
    (id, scenario, newData) => {
      const index =
        id && scenario !== 'delete' && scenario !== 'bulkEdit'
          ? testCases?.testcases?.findIndex((x) => x._id === id)
          : null;

      if (scenario === 'add') {
        setTestCases((pre) => ({
          ...pre,
          count: (pre.count || 0) + 1,
          testcases: testCases.count < 25 * filters.page ? [...(pre.testcases || []), newData] : pre.testcases || [],
        }));
      } else if (id && scenario === 'edit') {
        const updatedTestCases = testCases?.testcases?.map((testcase, i) => {
          if (i === index) {
            return newData; // NOTE: Update the element at the specified index
          } else {
            return testcase; // NOTE: Keep the other elements unchanged
          }
        });
        setTestCases((pre) => ({ ...pre, testcases: updatedTestCases }));
      } else if (scenario === 'delete' && id?.length) {
        const updatedTestCases = testCases?.testcases?.filter((testCase) => !id.includes(testCase._id));
        setTestCases((pre) => ({
          ...pre,
          count: (pre.count || 0) - id?.length,
          testcases: updatedTestCases,
        }));
      } else if (scenario === 'bulkEdit' && id?.length) {
        const updatedTestCases = testCases?.testcases.map((testCase) => {
          const newTestCase = newData.find((newTestCase) => newTestCase._id === testCase._id);

          return newTestCase || testCase;
        });
        setTestCases((pre) => ({
          ...pre,
          count: pre.count,
          testcases: updatedTestCases,
        }));
      }

      fetchTestCases(filters);
    },
    [testCases, filters, fetchTestCases],
  );

  // NOTE: Deleting Single orBulk Records
  const onDelete = useCallback(
    async (e, bulk) => {
      try {
        const res = await _deleteTestCaseHandler({
          body: {
            toDelete: bulk ? selectedRecords : [delModal?.id],
          },
        });
        toastSuccess(res.msg);
        refetchHandler(bulk ? selectedRecords : [delModal?.id], 'delete');

        // NOTE: await fetchTestCases(filters);
        setDelModal(() => ({ open: false }));
        setViewTestCase(false);
        setViewTestCaseId('');

        if (bulk) {
          setSelectedRecords([]);
        }
      } catch (error) {
        toastError(error);
      }
    },
    [_deleteTestCaseHandler, selectedRecords, delModal?.id, toastSuccess, refetchHandler, toastError],
  );

  // NOTE: onFilter Apply
  const onFilterApply = debounce(() => {
    setTestCases({
      count: 0,
      testcases: [],
    });
    setFilters((pre) => ({
      ...pre,
      projects: projectId ? [projectId] : [],
      page: 1,
      ...(watch('search') && { search: watch('search') }),
      ...(watch('projects') && { projects: watch('projects') || [] }),
      ...(watch('milestones') && { milestones: watch('milestones') || [] }),
      ...(watch('features') && { features: watch('features') || [] }),
      ...(watch('status') && { status: watch('status') || [] }),
      ...(watch('createdBy') && { createdBy: watch('createdBy') || [] }),
      ...(watch('state') && { state: watch('state') || [] }),
      ...(watch('tags') && { tags: watch('tags') || [] }),
      ...(watch('assignedTo') && { assignedTo: watch('assignedTo') || [] }),

      ...(watch('lastTestedBy') && {
        lastTestedBy: watch('lastTestedBy') || [],
      }),
      ...(watch('testType') && { testType: watch('testType') || [] }),
      ...(watch('weightage') && { weightage: watch('weightage') || [] }),
      ...(watch('createdAt') &&
        watch('createdAt.start') &&
        watch('createdAt.end') && {
          createdAt: {
            start: formattedDate(watch('createdAt.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('createdAt.end'), 'yyyy-MM-dd'),
          },
        }),
      ...(watch('lastTestedAt') &&
        watch('lastTestedAt.start') &&
        watch('lastTestedAt.end') && {
          lastTestedAt: {
            start: formattedDate(watch('lastTestedAt.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('lastTestedAt.end'), 'yyyy-MM-dd'),
          },
        }),
    }));

    const filterObject = filterNames?.reduce(
      (acc, filterName) => {
        const filterValue = watch(filterName);

        if (filterValue !== undefined && filterValue !== null) {
          if (filterName === 'createdAt' || filterName === 'lastTestedAt' || filterName === 'reTestDate') {
            const startDate = watch(`${filterName}.start`);
            const endDate = watch(`${filterName}.end`);

            if (startDate !== undefined && endDate !== undefined && startDate !== null && endDate !== null) {
              acc[`${filterName}.start`] = formattedDate(startDate, 'yyyy-MM-dd');
              acc[`${filterName}.end`] = formattedDate(endDate, 'yyyy-MM-dd');
            }
          } else {
            acc[filterName] = Array.isArray(filterValue) ? filterValue : [filterValue];
          }
        }

        return acc;
      },
      noHeader ? { active: 1 } : {},
    );

    setFiltersParams(filterObject);
    countAppliedFilters();
    setAllowFilterDrawer(false);
    setIsOpen(false);
  }, 1000);

  const submitHandlerTask = useCallback(
    async (data, formRunData) => {
      try {
        const [res, runRes] = await Promise.all([
          _createTaskHandler(data),
          formRunData ? _createTestRunHandler(formRunData) : Promise.resolve(null),
        ]);
        setSelectedBugs([]);
        setSelectedRecords([]);
        setSelectedRunRecords([]);
        setOpenTaskModal({ open: false });
        toastSuccess(`${res.msg} ${formRunData ? runRes?.msg : ''}`);
      } catch (error) {
        toastError(error);
      }
    },
    [_createTaskHandler, _createTestRunHandler, toastSuccess, toastError],
  );

  const submitHandlerJiraTask = useCallback(
    async (id, body, formRunData) => {
      try {
        const [res, runRes] = await Promise.all([
          _createJiraTaskHandler({ id, body }),
          formRunData ? _createTestRunHandler(formRunData) : Promise.resolve(null),
        ]);
        toastSuccess(`${res.msg} ${formRunData ? runRes?.msg : ''}`);
        setOpenTaskModal({ open: false });
        setSelectedBugs([]);
        setSelectedRecords([]);
        setSelectedRunRecords([]);
      } catch (error) {
        toastError(error);
      }
    },
    [_createJiraTaskHandler, _createTestRunHandler, toastSuccess, toastError],
  );

  // NOTE: bulkEditTest
  const onBulkEdit = useCallback(
    async (data, setError) => {
      try {
        let formData = {
          ...data,
          testCaseIds: data.selectedRecords,
          testSteps: {
            ...data.testSteps,
            description: JSON.stringify(data.testSteps?.description),
          },
          preConditions: {
            ...data.preConditions,
            description: JSON.stringify(data.preConditions?.description),
          },
          featureId: data?.featureId?._id || data?.featureId,
          milestoneId: data?.milestoneId?._id || data?.milestoneId,
        };
        !formData?.milestoneId && delete formData?.milestoneId;
        !formData?.featureId && delete formData?.featureId;
        !formData?.testSteps?.text && delete formData?.testSteps;
        !formData?.preConditions?.text && delete formData?.preConditions;

        const res = await _bulkEditHandler({ body: formData });
        toastSuccess(res?.msg);
        setBulkEdit(false);
        setSelectedRecords([]);
        setSelectedRunRecords([]);
        setSelectedBugs([]);
        refetchHandler(data.selectedRecords, 'bulkEdit', res?.testCaseData);
      } catch (error) {
        toastError(error, setError);
      }
    },
    [_bulkEditHandler, refetchHandler, toastError, toastSuccess],
  );

  const handleResetChip = useCallback(
    (type) => {
      setValue(type, []);
      onFilterApply();
      setFiltersParams((prevParams) => ({ ...prevParams, [type]: [] }));
    },
    [setValue, onFilterApply, setFiltersParams],
  );

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
      refetchHandler(statusUpdateTestCaseId, 'edit', res?.testCaseData);
    },
    [statusUpdateTestCaseId, _updateStatusTestCase, toastSuccess, refetchHandler],
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
    [setBugModal, statusUpdateHandler, toastError],
  );

  const bugModelCloseHandler = useCallback(async () => {
    setBugModal('');
    await statusUpdateHandler(bugModal);
  }, [bugModal, statusUpdateHandler]);

  const handleCloseEditModal = useCallback(() => setBulkEdit(false), []);

  const countNonEmptyElements = useCallback(
    (data) => {
      let count = 0;

      for (let key in data) {
        if (key === 'page' || key === 'perPage' || key === 'search' || (noHeader && key === 'projects')) {
          continue;
        }

        const value = data[key];

        if (Array.isArray(value) && value.length > 0) {
          count++;
        } else if (typeof value === 'object' && value !== null && Object.values(value).some((v) => v !== null)) {
          count++;
        } else if (
          typeof value === 'number' ||
          typeof value === 'boolean' ||
          (typeof value === 'string' && value !== '')
        ) {
          count++;
        }
      }

      return count;
    },
    [noHeader],
  );

  useEffect(() => {
    if (paramFilters) {
      const paramsCount = countNonEmptyElements(paramFilters);
      setFiltersCount(paramsCount);
    }
  }, [countNonEmptyElements, paramFilters]);

  const handleFilterBtnClick = useCallback(() => {
    setAllowFilterDrawer((prevState) => !prevState);
    setViewTestCase(false);
    setViewTestRun(false);
  }, [setAllowFilterDrawer, setViewTestCase, setViewTestRun]);

  const handleOnFilterClickFunc = useCallback(() => {
    onFilterApply();
  }, [onFilterApply]);

  const onResetStatusClickFunc = useCallback(() => {
    handleResetChip('status');
  }, [handleResetChip]);

  const onResetStateClickFunc = useCallback(() => {
    handleResetChip('state');
  }, [handleResetChip]);

  const onAddTestCaseFunc = useCallback(() => {
    setIsAddTestCase({ open: true });
  }, []);

  const onAddTestCaseFalseFunc = useCallback(() => {
    setIsAddTestCase({ open: false });
  }, []);

  const onMoreIconClickFunc = useCallback(() => {
    setOpen(true);
  }, []);

  const onMoreIconClick2Func = useCallback(() => {
    setIsOpen2(true);
  }, []);

  const onBulkEditTrueFunc = useCallback(() => {
    setBulkEdit(true);
  }, []);

  const onTaskModalTrueFunc = useCallback(() => {
    setOpenTaskModal({ open: true });
  }, []);

  const onTaskModalFalseFunc = useCallback(() => {
    setOpenTaskModal({ open: false });
  }, []);

  const onViewTesRunTrueFunc = useCallback(() => {
    setViewTestRun(true);
  }, []);

  const onSetBugModalFunc = useCallback(() => {
    setBugModal('');
  }, []);

  const onTestingModalCloseFunc = useCallback(() => {
    setIsReportBug({ open: false });
  }, []);

  const onDelModalCloseFunc = useCallback(() => {
    setDelModal({ open: false });
  }, []);

  const onSplitClickFunc = useCallback(() => {
    setViewTestCase(false);
    setViewTestCaseId('');
    setViewTestRun(false);
    setEditRecord(null);
  }, []);

  const handleDelBtnClick = useCallback(() => {
    if (selectedRecords.length > 0) {
      setDelModal({ open: true, bulk: true });
    } else {
      toastError({ msg: 'Select Test Cases to delete' });
    }
  }, [selectedRecords.length, toastError]);

  const onImportTrueFunc = useCallback(() => {
    setIsImportActive(true);
  }, [setIsImportActive]);

  const onFilterChangeClickHeader = useCallback(
    ({ sortBy, sort }) => {
      handleFilterChange({ sortBy, sort });
    },
    [handleFilterChange],
  );

  const clickDelBulkHandler = useCallback(
    (e) => {
      onDelete(e, delModal.bulk);
    },
    [delModal.bulk, onDelete],
  );

  const onReportBugClickHandler = useCallback(() => {
    if (userDetails?.activePlan === 'Free') {
      statusUpdateHandler(bugModal);
    } else {
      setIsReportBug({ open: true });
      setEditRecord({ id: testCase?._id, type: 'testCases', refetch: refetch });
      setBugModal(false);
      setStatusUpdateTestCaseId(false);
    }
  }, [
    userDetails,
    statusUpdateHandler,
    bugModal,
    setIsReportBug,
    setEditRecord,
    setBugModal,
    setStatusUpdateTestCaseId,
    testCase,
    refetch,
  ]);

  return (
    <>
      <div className={`${!noHeader ? style.wrap : style.wrapNoHeader}`}>
        <SplitPane
          sizes={sizes}
          onChange={setSizes}
          allowResize={(viewTestCase || viewTestRun) && !statusUpdateTestCaseId && !stopDrag}
        >
          <MainWrapper
            title="Test Cases"
            date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
            stylesBack={noHeader ? { marginTop: '10px', height: 'calc(100vh - 150px)' } : {}}
            noHeader={noHeader}
          >
            <div className={style.main}>
              <div
                className={style.flexBetween}
                style={{
                  justifyContent: userDetails?.role === 'Developer' ? 'end' : '',
                }}
              >
                <div className={style.exportDiv}>
                  <Button
                    startCompo={filtersCount > 0 ? <Icon name={'FilterIconOrange'} /> : <Icon name={'FilterIcon'} />}
                    text={`Filters ${filtersCount ? `(${filtersCount})` : ''}`}
                    btnClass={filtersCount > 0 ? style.filterBtnActive : style.filterBtn}
                    handleClick={handleFilterBtnClick}
                    data-cy="addtestcase-filter-btn"
                  />

                  <TextField
                    searchField
                    searchIcon={true}
                    clearIcon={clearIcon}
                    startIconClass={style.startIcon}
                    placeholder="Type and search..."
                    onClear={debounce(() => {
                      setTestCases({
                        count: 0,
                        testcases: [],
                      });
                      setFilters((pre) => ({ ...pre, page: 1, search: '' }));
                    }, 1000)}
                    onChange={debounce((e) => {
                      setTestCases({
                        count: 0,
                        testcases: [],
                      });
                      setFilters((pre) => ({
                        ...pre,
                        page: 1,
                        search: e.target.value,
                      }));
                    }, 1000)}
                  />
                </div>
                <div className={style.chipsDiv}>
                  <FilterChip
                    isDisabled={!watch('status')?.length}
                    watch={watch}
                    backHidden={style.hiddenClass}
                    applyFilter={handleOnFilterClickFunc}
                    name={'status'}
                    label={'Status'}
                    isMulti
                    options={data?.statusOptions}
                    paramFilter={paramFilters?.status}
                    control={control}
                    onReset={onResetStatusClickFunc}
                  />
                  <FilterChip
                    backHidden={style.hiddenClass}
                    isDisabled={!watch('state')?.length}
                    watch={watch}
                    applyFilter={handleOnFilterClickFunc}
                    label={'State'}
                    name={'state'}
                    paramFilter={paramFilters?.state}
                    isMulti
                    options={[
                      { label: 'Active', value: 'Active', checkbox: true },
                      { label: 'Obsolete', value: 'Obsolete', checkbox: true },
                    ]}
                    control={control}
                    onReset={onResetStateClickFunc}
                    openLeft={true}
                  />
                  <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                    <Button
                      id={'addTestCaseBtn'}
                      data-cy="addtestcase-btn"
                      text="Add Test Case"
                      handleClick={onAddTestCaseFunc}
                    />
                  </Permissions>
                  <Permissions
                    allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                    currentRole={userDetails?.role}
                    locked={false}
                  >
                    <div className={`${style.moreMenu} ${style.hiddenClass}`} onClick={onMoreIconClickFunc}>
                      <Icon name={'MoreInvertIcon'} height={24} width={24} />
                      {open && (
                        <div className={style.modalDiv}>
                          {userDetails?.role !== 'Developer' && (
                            <div onClick={onImportTrueFunc} className={style.flexImport}>
                              <Icon name={'ImportIcon'} />
                              <p>Import Test Cases</p>
                            </div>
                          )}
                          <div className={style.flexImport} onClick={exportHandler}>
                            <Icon name={'ExportIcon'} />
                            <p>Export Test Cases</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Permissions>
                </div>

                <div className={style.optionsDivMobile}>
                  {filtersCount > 0 && (
                    <div>
                      <span onClick={handleResetFilters}>Reset Filters</span>
                    </div>
                  )}
                  <div onClick={onMoreIconClickFunc} className={style.position_relative}>
                    <Icon name={'MenuIcon'} />
                    {filtersCount > 0 && <div className={style.filterCountDot}>{filtersCount}</div>}
                  </div>
                  <div className={style.hiddenClass} onClick={onMoreIconClick2Func}>
                    <Icon name={'MoreInvertIcon'} />
                  </div>
                </div>
              </div>

              <div className={style.headerDivMobile}>
                <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
                  <FilterHeader
                    paramFilters={paramFilters}
                    projectSpecific={projectId}
                    mobileView
                    {...{
                      control,
                      register,
                      watch,
                      setValue,
                    }}
                    reset={handleResetFilters}
                    onFilterApply={onFilterApply}
                  />
                </MobileMenu>
              </div>
              {_isLoading && filters?.page < 2 ? (
                <Loader />
              ) : (
                <>
                  {testCases?.count ? (
                    <div>
                      <div className={style.mainClass}>
                        <h6>
                          Test Cases ({selectedRecords.length ? `${selectedRecords.length}/` : ''}
                          {testCases?.count})
                        </h6>
                        <Permissions
                          allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                          currentRole={userDetails?.role}
                          locked={userDetails?.activePlan === 'Free'}
                        >
                          <div className={`${style.moreMenu} ${style.smallDisplay}`} onClick={onMoreIconClickFunc}>
                            <Icon name={'MoreInvertIcon'} height={24} width={24} />

                            {open && (
                              <div className={style.modalDiv}>
                                <div onClick={onImportTrueFunc} className={style.flexImport}>
                                  <Icon name={'ImportIcon'} />
                                  <p>Import Test Cases</p>
                                </div>
                                <div className={style.flexImport} onClick={exportHandler}>
                                  <Icon name={'ExportIcon'} />
                                  <p>Export Test Cases</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </Permissions>

                        <div className={style.flex}>
                          <div className={style.secondMenu}>
                            {every(
                              selectedRunRecords,
                              (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                            ) &&
                              selectedRunRecords.length > 1 && (
                                <Permissions
                                  allowedRoles={['Admin', 'Project Manager', 'QA']}
                                  currentRole={userDetails?.role}
                                >
                                  {' '}
                                  <div
                                    className={`${style.change} ${style.change_impose_style_primary}`}
                                    src={run}
                                    alt=""
                                    onClick={onBulkEditTrueFunc}
                                    data-cy="testcases-bulkedit-btn"
                                  >
                                    <p className={style.bulk_edit_text}>Bulk Edit</p>
                                  </div>
                                </Permissions>
                              )}
                            {every(
                              selectedRunRecords,
                              (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                            ) &&
                              selectedRecords.length > 0 && (
                                <div
                                  onClick={onTaskModalTrueFunc}
                                  className={style.addTask}
                                  data-cy="task-btn-testcases"
                                >
                                  <Icon name={'CreateTask'} height={24} width={24} />
                                </div>
                              )}
                            {every(
                              selectedRunRecords,
                              (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                            ) &&
                              selectedRunRecords.length > 0 && (
                                <div
                                  className={`${style.change} ${style.change_impose_style}`}
                                  src={run}
                                  alt=""
                                  onClick={onViewTesRunTrueFunc}
                                >
                                  <Icon name={'TestRunIcon'} height={24} width={24} />
                                  <div className={style.tooltip}>
                                    <p>Test Run</p>
                                  </div>
                                </div>
                              )}
                            {selectedRecords.length > 0 && (
                              <Permissions
                                allowedRoles={['Admin', 'Project Manager', 'QA']}
                                currentRole={userDetails?.role}
                              >
                                <div
                                  className={style.changeMain}
                                  src={deleteBtn}
                                  id={'deleteButton'}
                                  alt=""
                                  onClick={handleDelBtnClick}
                                >
                                  <div className={style.imgDelMain}>
                                    <Icon name={'DelIcon'} height={24} width={24} />
                                  </div>
                                  <div className={style.tooltip}>
                                    <p>Delete</p>
                                  </div>
                                </div>
                              </Permissions>
                            )}
                          </div>
                          <MobileMenu isOpen={isOpen2} setIsOpen={setIsOpen2}>
                            <div className={style.secondMenuMobile}>
                              {every(
                                selectedRunRecords,
                                (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                              ) &&
                                selectedRunRecords.length > 1 && (
                                  <Permissions
                                    allowedRoles={['Admin', 'Project Manager', 'QA']}
                                    currentRole={userDetails?.role}
                                  >
                                    {' '}
                                    <div className={style.change} src={run} alt="">
                                      <p>Bulk Edit</p>
                                    </div>
                                  </Permissions>
                                )}
                              {every(
                                selectedRunRecords,
                                (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                              ) &&
                                selectedRunRecords.length > 0 && (
                                  <div className={style.change} src={run} alt="" onClick={onViewTesRunTrueFunc}>
                                    <Icon name={'TestRunIcon'} />
                                    <p>Test Run</p>
                                  </div>
                                )}
                              {selectedRecords.length > 0 && (
                                <Permissions
                                  allowedRoles={['Admin', 'Project Manager', 'QA']}
                                  currentRole={userDetails?.role}
                                >
                                  <div
                                    className={style.change}
                                    src={deleteBtn}
                                    id={'deleteButton'}
                                    alt=""
                                    onClick={handleDelBtnClick}
                                  >
                                    <div className={style.imgDel}>
                                      <Icon name={'DelIcon'} />
                                    </div>
                                    <p>Delete</p>
                                  </div>
                                </Permissions>
                              )}
                              {selectedRecords.length > 0 && projectId && (
                                <div className={style.change} onClick={onTaskModalTrueFunc}>
                                  <Icon name={'PlusIcon'} />
                                  <p>Task</p>
                                </div>
                              )}
                              <div className={style.change}>
                                {
                                  <Permissions
                                    allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                                    currentRole={userDetails?.role}
                                    locked={userDetails?.activePlan === 'Free'}
                                  >
                                    <Button
                                      handleClick={exportHandler}
                                      text="Export"
                                      startCompo={<Icon name={'ExportIcon'} />}
                                      btnClass={style.btn}
                                    />
                                  </Permissions>
                                }
                              </div>
                            </div>
                          </MobileMenu>
                        </div>
                      </div>
                      <div className={style.tableWidth}>
                        <GenericTable
                          noHeader={noHeader}
                          setRightClickedRecord={setRightClickedRecord}
                          optionMenu={optionMenu}
                          menu={menu}
                          setMenu={setMenu}
                          menuData={menuData({
                            moreMenu,
                            setMoreMenu,
                          })}
                          selectedItem={selectedRecords}
                          ref={containerRef}
                          columns={columnsData({
                            testCases: testCases?.testcases,
                            setSearchParams,
                            setSelectedRecords,
                            selectedRecords,
                            setSelectedRunRecords,
                            selectedRunRecords,
                            selectedBugs,
                            viewTestRun,
                            setSelectedBugs,
                            setViewTestCaseId,
                            delModal,
                            setDelModal,
                            setViewTestCase,
                            isHoveringName,
                            setIsHoveringName,
                            setEditRecord,
                            setDuplicateRecord,
                            role: userDetails?.role,
                            noHeader,
                            searchedText: filters?.search,
                            setStatusUpdateTestCaseId,
                            statusUpdateTestCaseId,

                            setIsAddTestCase,
                          })}
                          dataSource={testCases?.testcases || []}
                          height={noHeader ? 'calc(100vh - 295px)' : 'calc(100vh - 225px)'}
                          selectable={true}
                          filters={sortFilters}
                          onClickHeader={onFilterChangeClickHeader}
                          classes={{
                            test: style.test,
                            table: style.table,
                            thead: style.thead,
                            th: style.th,
                            containerClass: style.checkboxContainer,
                            tableBody: style.tableRow,
                          }}
                        />
                        {_isLoading && <Loader tableMode className={style.loaderClass} />}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={style.no_data_icon_container}
                      style={{
                        height: noHeader ? 'calc(100vh - 344px)' : 'calc(100vh - 275px)',
                      }}
                    >
                      <img src={noData} alt="" />
                    </div>
                  )}
                </>
              )}

              {open && <div className={style.backdrop} onClick={onMoreIconClickFunc} />}
            </div>
          </MainWrapper>
          <div className={style.flex1}>
            {viewTestCase && !reportBug && (
              <ViewTestCases
                setSelectedRecords={setSelectedRecords}
                setSelectedBugs={setSelectedBugs}
                setOpenTaskModal={setOpenTaskModal}
                copyTestCaseToClipboard={copyTestCaseToClipboard}
                optionMenu={optionMenu}
                setStopDrag={setStopDrag}
                setDrawerOpen={setViewTestCase}
                viewTestCase={viewTestCase}
                setViewTestCaseId={setViewTestCaseId}
                setDelModal={setDelModal}
                viewTestCaseId={viewTestCaseId}
                setReportBug={setReportBug}
                setEditRecord={setEditRecord}
                noHeader={noHeader}
                refetchAll={refetchHandler}
                setIsAddTestCase={setIsAddTestCase}
                projectId={projectId}
                editRecord={editRecord}
                setViewTestRun={setViewTestRun}
                duplicateRecord={duplicateRecord}
                setDuplicateRecord={setDuplicateRecord}
                setSelectedRunRecords={setSelectedRunRecords}
                selectedRunRecords={selectedRunRecords}
              />
            )}
            {viewTestRun && (
              <DrawerForRun
                setDrawerOpen={setViewTestRun}
                setSelectedRunRecords={setSelectedRunRecords}
                drawerOpen={viewTestRun}
                noHeader={noHeader}
                projectId={projectId ? projectId : selectedRunRecords[0]?.projectId?._id}
                selectedRunRecords={selectedRunRecords}
              />
            )}
            {(viewTestCase || viewTestRun) && (
              <div id="splitpane" className={style.display_none} onClick={onSplitClickFunc} />
            )}
          </div>
        </SplitPane>
      </div>
      {/*NOTE: SIDE MODAL */}

      {allowFilterDrawer && !viewTestRun && !viewTestCase && (
        <FiltersDrawer
          noHeader={noHeader}
          setDrawerOpen={setAllowFilterDrawer}
          projectSpecific={projectId}
          {...{
            control,
            register,
            tagsOptions,
            watch,
            setValue,
            reset: () => {
              reset({ ...initialFilter });
              setFilters(() => ({ ...initialFilter }));
              setTestCases({
                count: 0,
                testcases: [],
              });
              setSortFilters({ sortBy: '', sort: '' });
              setFiltersCount(0);
              setFiltersParams({});
            },
          }}
          isDirty={filtersCount > 0}
          onFilterApply={onFilterApply}
        />
      )}
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
          clickHandler={onReportBugClickHandler}
          locked={userDetails?.activePlan === 'Free'}
          setOpenDelModal={onSetBugModalFunc}
          isStatusUpdating={_isStatusUpdating}
        />
      )}

      {isReportBug?.open && (
        <StartTestingModal
          open={isReportBug.open}
          handleClose={onTestingModalCloseFunc}
          refetch={refetchHandler}
          projectId={projectId}
          editRecord={editRecord}
          statusData={watch()}
          setEditRecord={setEditRecord}
        />
      )}

      {!!openTaskModal.open && (
        <CreateTaskModal
          testCaseData={selectedBugs}
          setSelectedBugs={setSelectedBugs}
          projectId={projectId}
          selectedRecords={selectedRecords}
          setSelectedRecords={setSelectedRecords}
          setSelectedRunRecords={setSelectedRunRecords}
          isSubmitting={_createTaskIsLoading || _createRunIsLoading}
          submitHandlerTask={submitHandlerTask}
          submitHandlerJiraTask={submitHandlerJiraTask}
          isJiraSubmitting={_createJiraTaskIsLoading}
          openDelModal={!!openTaskModal.open}
          setOpenDelModal={onTaskModalFalseFunc}
        />
      )}

      {delModal.open && (
        <DeleteModal
          openDelModal={!!delModal.open}
          setOpenDelModal={onDelModalCloseFunc}
          name="test case"
          clickHandler={clickDelBulkHandler}
          isLoading={_isDeleteLoading}
          cancelText="No, Keep this test case"
        />
      )}

      {bulkEdit && (
        <BulkEditModal
          type={'testCase'}
          open={bulkEdit}
          refetch={refetchData}
          handleClose={handleCloseEditModal}
          projectId={projectId ? projectId : selectedRunRecords[0]['projectId']?._id}
          selectedRecords={selectedRecords}
          options={data}
          onSubmit={onBulkEdit}
          isLoading={_isBulkEditLoading}
        />
      )}

      {isAddTestCase?.open && (
        <AddTestCase
          open={isAddTestCase?.open}
          handleClose={onAddTestCaseFalseFunc}
          refetch={refetchHandler}
          projectId={projectId}
          editRecord={editRecord}
          setEditRecord={setEditRecord}
          duplicateRecord={duplicateRecord}
          setDuplicateRecord={setDuplicateRecord}
        />
      )}
    </>
  );
};

TestCases.propTypes = {
  noHeader: PropTypes.bool.isRequired,
  projects: PropTypes.string.isRequired,
};

export default TestCases;
