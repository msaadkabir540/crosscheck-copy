import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { debounce as _debounce, every as _every, pick as _pick } from 'lodash';

import { useAppContext } from 'context/app-context';

import DrawerForRun from 'pages/test-runs/drawer';

import SplitPane from 'components/split-pane/split-pane';
import Button from 'components/button';
import GenericTable from 'components/generic-table';
import MainWrapper from 'components/layout/main-wrapper';
import DeleteModal from 'components/delete-modal';
import TextField from 'components/text-field';
import Permissions from 'components/permissions';
import BulkEditModal from 'components/bulk-edit-modal';
import Loader from 'components/loader';
import CreateTaskModal from 'components/create-task-modal';
import FilterChip from 'components/filter-chip';
import MobileMenu from 'components/mobile-menu';
import Icon from 'components/icon/themed-icon';

import { useToaster } from 'hooks/use-toaster';

import { useGetTags } from 'api/v1/custom-tags/custom-tags';
import {
  useBulkEditBugs,
  useExportBugs,
  useDeleteBug,
  useGetBugsByFilter,
  useUpdateSeverityBug,
} from 'api/v1/bugs/bugs';
import { useCreateJiraTask, useCreateTask } from 'api/v1/task/task';
import { useCreateBugsRun } from 'api/v1/test-runs/test-runs';

import { pickBy } from 'utils/lodash';
import { envObject } from 'constants/environmental';
import { formattedDate } from 'utils/date-handler';
import { downloadCSV } from 'utils/file-handler';

import search from 'assets/search.svg';
import clearIcon from 'assets/cross.svg';
import run from 'assets/CreateRun.svg';
import threeDots from 'assets/threeDots.svg';
import noData from 'assets/no-found.svg';

import AddTestCaseModal from '../add-test-case';
import FilterHeader from '../header';
import ViewBug from '../view-bug';
import RetestModal from '../retest-modal';
import { columnsData, initialFilters, menuData } from '../helper';
import { useBugsFiltersOptions } from '../header/helper';
import style from '../testing.module.scss';
import FiltersDrawer from '../filters-drawer';
import StartTestingModal from '../start-reporting-bugs';

const filterNames = [
  'search',
  'projects',
  'milestones',
  'features',
  'tags',
  'testedEnvironment',
  'testedDevice',
  'status',
  'reportedBy',
  'bugBy',
  'assignedTo',
  'testingType',
  'bugType',
  'severity',
  'issueType',
  'closedDate',
  'reportedAt',
  'reTestDate',
];

const QaTesting = ({ noHeader = false, projectId, setIsImportActive }) => {
  const { data = {}, refetch } = useBugsFiltersOptions();
  const containerRef = useRef(null);
  const { control, register, watch, setValue, reset } = useForm();

  const { toastError, toastSuccess } = useToaster();
  const [searchParams, setSearchParams] = useSearchParams();
  const bugId = searchParams.get('bugId');

  const [addTestCase, setAddTestCase] = useState(false);
  const baseUrl = `${envObject?.BASE_URL}/qa-testing`;
  const [menu, setMenu] = useState(false);

  const [isStartTesting, setIsStartTesting] = useState({ open: false });

  const [editRecord, setEditRecord] = useState();
  const [duplicateRecord, setDuplicateRecord] = useState();
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [viewTestRun, setViewTestRun] = useState(false);
  const [allowFilterDrawer, setAllowFilterDrawer] = useState(false);
  const [selectedRunRecords, setSelectedRunRecords] = useState([]);
  const [selectedBugs, setSelectedBugs] = useState([]);

  const [bulkEdit, setBulkEdit] = useState(false);

  const [retestOpen, setRetestOpen] = useState({ open: false });
  const [openRetestModal, setOpenRetestModal] = useState(false);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [rightClickedRecord, setRightClickedRecord] = useState({});
  const [openCreateTicket, setOpenCreateTicket] = useState(false);
  const [open, setOpen] = useState(false);
  const [filtersParams, setFiltersParams] = useSearchParams();

  const [isHoveringName, setIsHoveringName] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const [viewBug, setViewBug] = useState(false);

  const [viewSizes, setViewSizes] = useState(['20%', 'auto']);

  const CONTAINER_REF_CURRENT = containerRef?.current;

  useEffect(() => {
    if (viewBug || viewTestRun) {
      if (window.innerWidth <= 768) {
        setViewSizes(['0%', '100%']);
      } else {
        setViewSizes(['65%', '35%']);
      }
    } else {
      setViewSizes(['100%', '0%']);
    }
  }, [viewBug, viewTestRun]);

  const { userDetails } = useAppContext();

  const [viewBugId, setViewBugId] = useState();
  const [isAddTestCase, setIsAddTestCase] = useState({ open: false });
  const [filtersCount, setFiltersCount] = useState(0);

  const [filters, setFilters] = useState({
    ...initialFilters,
    projectId: projectId ? [projectId] : [],
  });

  const [sortFilters, setSortFilters] = useState({
    sortBy: '',
    sort: '',
  });

  const paramFilters = useMemo(() => {
    const result = {};

    for (const paramName of filterNames) {
      if (paramName === 'search') {
        result[paramName] = filtersParams?.get(paramName) || '';
      } else if (['reportedAt', 'closedDate', 'reTestDate']?.includes(paramName)) {
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
      reportedAt: result?.reportedAt || { start: null, end: null },
      closedDate: result?.closedDate || { start: null, end: null },
      reTestDate: result?.reTestDate || { start: null, end: null },
      page: filters?.page,
      perPage: 25,
      taskId: '',
    };
  }, [filtersParams, filters?.page, filters?.search]);

  const [bugs, setBugs] = useState({});

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

    if (watch('tags')?.length > 0) {
      count++;
    }

    if (watch('testedDevice')?.length > 0) {
      count++;
    }

    if (watch('testedEnvironment')?.length > 0) {
      count++;
    }

    if (watch('status')?.length > 0) {
      count++;
    }

    if (watch('bugType')?.length > 0) {
      count++;
    }

    if (watch('issueType')?.length > 0) {
      count++;
    }

    if (watch('severity')?.length > 0) {
      count++;
    }

    if (watch('testingType')?.length > 0) {
      count++;
    }

    if (watch('reportedBy')?.length > 0) {
      count++;
    }

    if (watch('bugBy')?.length > 0) {
      count++;
    }

    if (watch('assignedTo')?.length > 0) {
      count++;
    }

    if (watch('reportedAt')?.start !== null && watch('reportedAt')?.start !== undefined) {
      count++;
    }

    if (watch('closedDate')?.start !== null && watch('closedDate')?.start !== undefined) {
      count++;
    }

    if (watch('reTestDate')?.start !== null && watch('reTestDate')?.start !== undefined) {
      count++;
    }

    return setFiltersCount(count);
  };

  const { mutateAsync: _getAllBugs, isLoading: _isLoading } = useGetBugsByFilter();

  const { data: _tagsData } = useGetTags({
    id: projectId || watch('projects'),
  });

  const tagsOptions = useMemo(() => {
    return (
      _tagsData?.tags?.map((x) => ({
        label: x.name,
        value: x._id,
        checkbox: true,
      })) || []
    );
  }, [_tagsData?.tags]);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = containerRef.current;

    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (bugs?.count !== bugs?.bugs.length && !_isLoading) {
        CONTAINER_REF_CURRENT?.removeEventListener('scroll', handleScroll);

        setFilters((prev) => ({ ...prev, page: prev?.page + 1, projects: projectId ? [projectId] : [] }));
        // NOTE: Scroll up by 10 pixels from the last scroll position
        CONTAINER_REF_CURRENT?.scrollTo(scrollLeft, scrollTop - 10);
      }
    }
  }, [_isLoading, projectId, bugs?.count, CONTAINER_REF_CURRENT, bugs?.bugs?.length]);

  useEffect(() => {
    const currentContainer = containerRef.current;

    if (containerRef.current && !_isLoading) {
      currentContainer?.addEventListener('scroll', handleScroll);
    }

    return () => {
      !_isLoading ? currentContainer?.removeEventListener('scroll', handleScroll) : () => {};
    };
  }, [containerRef, _isLoading, handleScroll]);

  // NOTE: fetching bugs

  const bugsHandler = useCallback(
    async (filters) => {
      const response = await _getAllBugs(
        pickBy({ ...filters, issueType: 'New Bug' }, (value, key) => {
          if (key === 'reportedAt' || key === 'closedDate' || key === 'reTestDate') {
            return !(value.start === null);
          }

          return true;
        }),
      );
      setBugs((pre) => ({
        ...(pre || {}),
        count: response?.count || 0,
        bugs: filters.page === 1 ? response?.bugs : [...(pre.bugs || []), ...(response?.bugs || [])],
      }));
    },
    [_getAllBugs],
  );

  const { mutateAsync: _exportBugs } = useExportBugs();

  const exportHandler = useCallback(async () => {
    try {
      const res = await _exportBugs(
        pickBy(
          {
            ...filters,
            page: 0,
          },
          (value, key) => {
            if (key === 'reportedAt' || key === 'closedDate' || key === 'reTestDate') {
              return !(value.start === null);
            }

            return true;
          },
        ),
      );

      if (res) {
        downloadCSV(res, `Bugs Export File ${new Date()}`);
      }

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }, [_exportBugs, filters]);

  const fetchBugs = useCallback(
    async (filters) => {
      try {
        bugsHandler({ ...filters, ...sortFilters });
      } catch (error) {
        toastError(error);
      }
    },
    [bugsHandler, sortFilters, toastError],
  );

  const refetchHandler = useCallback(
    (id, scenario, newData) => {
      const index = id && scenario !== 'delete' ? bugs?.bugs?.findIndex((x) => x._id === id) : null;

      if (scenario === 'add') {
        setBugs((pre) => ({
          ...pre,
          count: (pre.count || 0) + 1,
          bugs: bugs.count < 25 * filters.page ? [newData, ...(pre.bugs || [])] : pre.bugs || [],
        }));
      } else if (id && scenario === 'edit') {
        const updatedBugs = bugs?.bugs?.map((bug, i) => {
          if (i === index) {
            return newData; // NOTE: Update the element at the specified index
          } else {
            return bug; // NOTE: Keep the other elements unchanged
          }
        });
        setBugs((pre) => ({ ...pre, bugs: updatedBugs }));
      } else if (scenario === 'delete' && id?.length) {
        const updatedBugs = bugs?.bugs?.filter((bug) => !id.includes(bug._id));
        setBugs((pre) => ({
          ...pre,
          count: (pre.count || 0) - id?.length,
          bugs: updatedBugs,
        }));
      } else if (scenario === 'bulkEdit' && id?.length) {
        const updatedBugs = bugs?.bugs.map((bug) => {
          const newBug = newData.find((newBug) => newBug._id === bug._id);

          return newBug || bug;
        });
        setBugs((pre) => ({
          ...pre,
          count: pre.count,
          bugs: updatedBugs,
        }));
      }

      fetchBugs(filters);
    },
    [bugs, fetchBugs, filters],
  );

  useEffect(() => {
    const _values = _pick(Object.fromEntries([...searchParams]), [
      'reportedBy',
      'reportedAtStart',
      'reportedAtEnd',
      'issueType',
      'status',
      'retestDateStart',
      'retestDateEnd',
    ]);

    if (_values.reportedBy) {
      _values.reportedBy = _values?.reportedBy?.split(',') || [];
    }

    if (_values.issueType) {
      _values.issueType = _values?.issueType?.split(',') || [];
    }

    if (_values.status) {
      _values.status = _values?.status?.split(',') || [];
    }

    if (_values?.reportedAtStart && _values?.reportedAtEnd) {
      _values.reportedAt = {
        start: new Date(_values?.reportedAtStart),
        end: new Date(_values?.reportedAtEnd),
      };
    }

    if (_values?.retestDateStart && _values?.retestDateEnd) {
      _values.reTestDate = {
        start: new Date(_values?.retestDateStart),
        end: new Date(_values?.retestDateEnd),
      };
    }

    delete _values.reportedAtStart;
    delete _values.reportedAtEnd;
    delete _values.retestDateStart;
    delete _values.retestDateEnd;

    Object.entries(_values).forEach(([key, val]) => {
      setValue(key, val);
    });
  }, [searchParams, setValue]);

  useEffect(() => {
    !_isLoading &&
      fetchBugs(
        projectId
          ? paramFilters
            ? { ...paramFilters, ...(watch('search') && { search: watch('search') }), projects: [projectId] }
            : { ...filters, ...(watch('search') && { search: watch('search') }), projects: [projectId] }
          : paramFilters
            ? { ...paramFilters, ...(watch('search') && { search: watch('search') }) }
            : {
                ...filters,
                ...(watch('search') && { search: watch('search') }),
                ...(projectId && { projects: [projectId] }),
                ...(watch('reportedBy') && { reportedBy: watch('reportedBy') }),
                ...(watch('issueType') && { issueType: watch('issueType') }),
                ...(watch('status') && { status: watch('status') }),
                ...(watch('tags') && { tags: watch('tags') }),
                ...(watch('testedDevice') && { testedDevice: watch('testedDevice') }),
                ...(watch('testedEnvironment') && { testedEnvironment: watch('testedEnvironment') }),
                ...(watch('reportedAt.start') &&
                  watch('reportedAt.end') && {
                    reportedAt: {
                      start: formattedDate(watch('reportedAt.start'), 'yyyy-MM-dd'),
                      end: formattedDate(watch('reportedAt.end'), 'yyyy-MM-dd'),
                    },
                  }),

                ...(watch('reTestDate.start') &&
                  watch('reTestDate.end') && {
                    reTestDate: {
                      start: formattedDate(watch('reTestDate.start'), 'yyyy-MM-dd'),
                      end: formattedDate(watch('reTestDate.end'), 'yyyy-MM-dd'),
                    },
                  }),
              },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, fetchBugs, paramFilters, projectId, watch]);

  const handleResetFilters = useCallback(() => {
    reset({ ...initialFilters });
    setFilters(() => ({ ...initialFilters, projects: projectId ? [projectId] : [] }));
    setBugs({
      count: 0,
      bugs: [],
    });
    setSortFilters({ sortBy: '', sort: '' });
    setIsOpen(false);
    setFiltersCount(0);
    setFiltersParams({});
  }, [projectId, reset, setFiltersParams]);

  useEffect(() => {
    if (projectId) {
      setBugs({
        count: 0,
        bugs: [],
      });
      setFilters((pre) => ({
        ...pre,
        projectId: projectId ? [projectId] : [],
        projects: projectId ? [projectId] : [],
      }));
    }
  }, [projectId, handleResetFilters]);

  // NOTE: Deleting Single orBulk Records
  const { mutateAsync: _deleteBugHandler, isLoading: deletingBug } = useDeleteBug();

  const onDelete = useCallback(async () => {
    try {
      const bulk = openDelModal.bulk;

      const res = await _deleteBugHandler({
        body: {
          toDelete: bulk ? selectedRecords : [openDelModal?.id],
        },
      });
      toastSuccess(res.msg);
      refetchHandler(bulk ? selectedRecords : [openDelModal?.id], 'delete');
      setOpenDelModal(() => ({ open: false }));
      setViewBug(false);
      setViewBugId('');
      setSearchParams({});
      bulk && setSelectedRecords([]);
    } catch (error) {
      toastError(error);
    }
  }, [
    _deleteBugHandler,
    openDelModal.bulk,
    openDelModal?.id,
    refetchHandler,
    selectedRecords,
    setSearchParams,
    toastError,
    toastSuccess,
  ]);

  const onFilterApply = _debounce(() => {
    setBugs({
      count: 0,
      bugs: [],
    });

    setFilters((pre) => ({
      ...pre,
      page: 1,
      projects: projectId ? [projectId] : [],
      ...(watch('search') && { search: watch('search') }),
      ...(watch('projects') && { projects: watch('projects') || [] }),
      ...(watch('milestones') && { milestones: watch('milestones') || [] }),
      ...(watch('features') && { features: watch('features') || [] }),
      ...(watch('tags') && { tags: watch('tags') || [] }),
      ...(watch('testedEnvironment') && { testedEnvironment: watch('testedEnvironment') || [] }),
      ...(watch('testedDevice') && { testedDevice: watch('testedDevice') || [] }),
      ...(watch('status') && { status: watch('status') || [] }),
      ...(watch('reportedBy') && {
        reportedBy: watch('reportedBy') || [],
      }),
      ...(watch('bugBy') && { bugBy: watch('bugBy') || [] }),
      ...(watch('assignedTo') && { assignedTo: watch('assignedTo') || [] }),
      ...(watch('testingType') && { testingType: watch('testingType') || [] }),
      ...(watch('bugType') && { bugType: watch('bugType') || [] }),
      ...(watch('severity') && { severity: watch('severity') || [] }),
      ...(watch('issueType') && { issueType: watch('issueType') || [] }),
      ...(watch('closedDate') &&
        watch('closedDate.start') &&
        watch('closedDate.end') && {
          closedDate: {
            start: formattedDate(watch('closedDate.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('closedDate.end'), 'yyyy-MM-dd'),
          },
        }),
      ...(watch('reportedAt') &&
        watch('reportedAt.start') &&
        watch('reportedAt.end') && {
          reportedAt: {
            start: formattedDate(watch('reportedAt.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('reportedAt.end'), 'yyyy-MM-dd'),
          },
        }),
      ...(watch('reTestDate') &&
        watch('reTestDate.start') &&
        watch('reTestDate.end') && {
          reTestDate: {
            start: formattedDate(watch('reTestDate.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('reTestDate.end'), 'yyyy-MM-dd'),
          },
        }),
    }));

    const filterObject = filterNames?.reduce(
      (acc, filterName) => {
        const filterValue = watch(filterName);

        if (filterValue !== undefined && filterValue !== null) {
          if (filterName === 'closedDate' || filterName === 'reportedAt' || filterName === 'reTestDate') {
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
      {
        active: noHeader && 2,
      },
    );

    setFiltersParams(filterObject);
    countAppliedFilters();
    setAllowFilterDrawer(false);
    setIsOpen(false);
  }, 1000);

  // NOTE: get users on frontend as per search query
  const handleFilterChange = _debounce(({ sortBy = '', sort = '' }) => {
    setSortFilters((pre) => ({
      ...pre,
      sortBy,
      sort,
    }));
  }, 1000);

  useEffect(() => {
    if (sortFilters?.sortBy) {
      setFilters((pre) => ({ ...pre, page: 1 }));
    }
  }, [sortFilters]);

  const { mutateAsync: _createTaskHandler, isLoading: _createTaskIsLoading } = useCreateTask();
  const { mutateAsync: _createBugRunHandler } = useCreateBugsRun();

  const submitHandlerTask = useCallback(
    async (data, formRunData) => {
      try {
        const [res, runRes] = await Promise.all([
          _createTaskHandler(data),
          formRunData && _createBugRunHandler(formRunData),
        ]);
        setOpenTaskModal({ open: false });
        setSelectedBugs([]);
        setSelectedRecords([]);
        setSelectedRunRecords([]);
        toastSuccess(`${res.msg} ${formRunData ? runRes.msg : ''}`);
      } catch (error) {
        toastError(error);
      }
    },
    [_createBugRunHandler, _createTaskHandler, toastError, toastSuccess],
  );

  const { mutateAsync: _createJiraTaskHandler, isLoading: _createJiraTaskIsLoading } = useCreateJiraTask();

  const submitHandlerJiraTask = useCallback(
    async (id, body, formRunData) => {
      try {
        const [res, runRes] = await Promise.all([
          _createJiraTaskHandler({
            id,
            body,
          }),
          formRunData && _createBugRunHandler(formRunData),
        ]);
        toastSuccess(`${res.msg} ${formRunData ? runRes.msg : ''}`);
        setOpenTaskModal({ open: false });
        setSelectedRecords([]);
        setSelectedBugs([]);
        setSelectedRunRecords([]);
      } catch (error) {
        toastError(error);
      }
    },
    [_createBugRunHandler, _createJiraTaskHandler, toastError, toastSuccess],
  );

  useEffect(() => {
    if (bugId) {
      setViewBugId(bugId);
      setViewBug(true);
    }
  }, [bugId]);

  const { mutateAsync: _changeSeverityHandler } = useUpdateSeverityBug();

  const onChangeSeverity = async (id, value) => {
    try {
      const res = await _changeSeverityHandler({ id, body: { newSeverity: value } });
      refetchHandler(id, 'edit', res?.bugData);
      toastSuccess(res.msg);
    } catch (error) {
      toastError(error);
    }
  };

  const handleDuplicate = useCallback(
    (e) => {
      e.preventDefault();
      setDuplicateRecord({ id: rightClickedRecord?._id });
      setIsStartTesting({ open: true });
    },
    [rightClickedRecord],
  );

  const { mutateAsync: _bulkEditHandler, isLoading: _isBulkEditLoading } = useBulkEditBugs();

  const onBulkEdit = useCallback(
    async (data, setError) => {
      try {
        !data?.testedVersion && delete data?.testedVersion;

        if (!data?.featureId?._id || !data?.featureId) {
          delete data?.featureId;
        }

        if (!data?.milestoneId?._id || !data?.milestoneId) {
          delete data?.milestoneId;
        }

        let formData = {
          ...data,
          featureId: data?.featureId?._id || data?.featureId,
          milestoneId: data?.milestoneId?._id || data?.milestoneId,
          bugIds: data.selectedRecords,
          bugSubType: data?.bugSubType?.value,
        };
        const res = await _bulkEditHandler({ body: formData });
        toastSuccess(res?.msg);
        setBulkEdit(false);
        setSelectedRecords([]);
        setSelectedBugs([]);
        setSelectedRunRecords([]);
        refetchHandler(data.selectedRecords, 'bulkEdit', res?.bugData);
      } catch (error) {
        toastError(error, setError);
      }
    },
    [_bulkEditHandler, refetchHandler, toastError, toastSuccess],
  );

  const copyDataToClipboard = useCallback(
    async (data, linkOnly) => {
      try {
        const textArea = document.createElement('textarea');

        const formattedText = `
      Bug ID: ${data.bugId}  ${baseUrl}?bugId=${data.bugId}
      Status: ${data.status}
      Severity: ${data.severity}
      Feedback: 
      ${data.feedback.text}
      Steps to Reproduce:
       ${data.reproduceSteps.text}
      Ideal Behaviour:
       ${data.idealBehaviour.text}
      Latest Test Evidence:
       ${data.testEvidence}
      Reported By:
       ${data.reportedBy.name}`;
        const evidenceLink = data.testEvidence;

        textArea.value = linkOnly ? evidenceLink : formattedText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toastSuccess('Copied');
      } catch (error) {
        console.error('Error copying bug data to clipboard:', error);
      }
    },
    [baseUrl, toastSuccess],
  );

  const optionMenu = [
    {
      bodyData: [
        {
          click: (e) => {
            e.preventDefault();
            setEditRecord({ id: rightClickedRecord?._id });
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
          click: () => setRetestOpen(() => ({ open: true, id: rightClickedRecord?._id })),
          icon: <Icon name={'RetestIcon'} iconClass={style.editColor} />,
          text: 'Retest',
        },
      ],
    },

    {
      bodyData: [
        {
          click: () =>
            window.open(
              rightClickedRecord?.history[rightClickedRecord?.history?.length - 1]?.reTestEvidence ||
                rightClickedRecord?.testEvidence,
              '_blank',
            ),
          icon: <Icon name={'EvidenceLink'} iconClass={style.editColor} />,
          text: 'View Evidence',
        },
      ],
    },
    {
      bodyData: [
        {
          click: handleDuplicate,
          icon: <Icon name={'Duplicate'} iconClass={style.editColor} />,
          text: 'Duplicate Bug',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () => copyDataToClipboard(rightClickedRecord, true),
          icon: <Icon name={'CopyEvidenceIcon'} iconClass={style.editColor} />,
          text: 'Copy Evidence Link',
        },
      ],
    },
    {
      border: '1px solid #d6d6d6',
      bodyData: [
        {
          click: () => copyDataToClipboard(rightClickedRecord, false),
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
      bodyData: [
        {
          click: () =>
            selectedRunRecords.length > 1
              ? _every(
                  selectedRunRecords,
                  (runRecord) => runRecord?.projectId?._id === selectedRunRecords[0]?.projectId?._id,
                ) && setViewTestRun(true)
              : (setSelectedRunRecords((prev) => [...prev, rightClickedRecord]), setViewTestRun(true)),
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
            setEditRecord({ id: rightClickedRecord?._id, type: 'bugs' });
          },
          icon: <Icon name={'ConvertIcon'} iconClass={style.editColor} />,
          text: 'Convert to Test Case',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () =>
            setOpenDelModal({
              open: true,
              name: rightClickedRecord?.testCaseId,
              id: rightClickedRecord?._id,
            }),
          icon: <Icon name={'DelRedIcon'} />,
          text: 'Delete',
        },
      ],
    },
  ];

  const handleResetStatusChip = useCallback(() => {
    setValue('status', []);
    onFilterApply();
    setFiltersParams({ ...filtersParams, type: [] });
  }, [setValue, onFilterApply, filtersParams, setFiltersParams]);

  const handleResetAssignedToChip = useCallback(() => {
    setValue('assignedTo', []);
    onFilterApply();
    setFiltersParams({ ...filtersParams, type: [] });
  }, [setValue, onFilterApply, filtersParams, setFiltersParams]);

  const handleResetBugTypeChip = useCallback(() => {
    setValue('bugType', []);
    onFilterApply();
    setFiltersParams({ ...filtersParams, type: [] });
  }, [setValue, onFilterApply, filtersParams, setFiltersParams]);

  const handleResetBugByChip = useCallback(() => {
    setValue('bugBy', []);
    onFilterApply();
    setFiltersParams({ ...filtersParams, type: [] });
  }, [setValue, onFilterApply, filtersParams, setFiltersParams]);

  const handleCloseEditModal = useCallback(() => setBulkEdit(false), []);

  const handleFilterClick = useCallback(() => {
    setAllowFilterDrawer(!allowFilterDrawer);
    setViewBug(false);
  }, [allowFilterDrawer]);

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

  const handleReportBug = useCallback(() => setIsStartTesting({ open: true }), []);

  const onClickMoreIcon = useCallback(() => setOpen(true), []);

  const onClickImportIcon = useCallback(() => setIsImportActive(true), [setIsImportActive]);

  const onMenuIcon = useCallback(() => setIsOpen(true), []);

  const onThreeDots = useCallback(() => setIsOpen2(true), []);

  const onBulkEditBtn = useCallback(() => setBulkEdit(true), []);

  const onCreateTask = useCallback(() => setOpenTaskModal({ open: true }), []);

  const onTestRunIcon = useCallback(() => setViewTestRun(true), []);

  const onDeleteIcon = useCallback(
    () =>
      selectedRecords.length > 0
        ? setOpenDelModal({ open: true, bulk: true })
        : toastError({
            msg: 'Select Test Cases to delete',
          }),
    [selectedRecords, toastError],
  );

  const onPlusIcon = useCallback(() => setOpenTaskModal({ open: true }), []);

  const onBackDropClick = useCallback(() => setOpen(false), []);

  const onSplitPane = useCallback(() => {
    setViewBug(false);
    setViewBugId('');
    setEditRecord(null);
  }, []);

  const handleCloseTestingModal = useCallback(() => setIsStartTesting({ open: false }), []);

  const handleCloseAddTestModal = useCallback(() => {
    setIsAddTestCase({ open: false });
    setSelectedRecords([]);
    setSelectedBugs([]);
    setSelectedRunRecords([]);
  }, []);

  const handleCloseDelModal = useCallback(() => setOpenDelModal({ open: false }), []);

  const handleCloseOpenDelModal = useCallback(() => setOpenTaskModal({ open: false }), []);

  const handleCloseRetestModal = useCallback(() => setRetestOpen({ open: false }), []);

  return (
    <>
      <div
        className={style.overflow_hidden}
        style={{
          height: !noHeader ? '100vh' : '85vh',
        }}
      >
        <SplitPane sizes={viewSizes} onChange={setViewSizes} allowResize={viewBug || viewTestRun}>
          <MainWrapper title="Bugs Reporting" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')} noHeader={noHeader}>
            <div className={`${style.mainTop} ${style.mainClass}`}>
              <div className={style.exportDiv}>
                <Button
                  startCompo={filtersCount > 0 ? <Icon name={'FilterIconOrange'} /> : <Icon name={'FilterIcon'} />}
                  text={`Filters ${filtersCount ? `(${filtersCount})` : ''}`}
                  btnClass={filtersCount > 0 ? style.filterBtnActive : style.filterBtn}
                  handleClick={handleFilterClick}
                />

                <TextField
                  searchField
                  icon={search}
                  startIconClass={style.startIcon}
                  clearIcon={clearIcon}
                  placeholder="Type and search..."
                  onClear={_debounce(() => {
                    setBugs({
                      count: 0,
                      bugs: [],
                    });
                    setFilters((pre) => ({ ...pre, page: 1, search: '' }));
                  }, 1000)}
                  onChange={_debounce((e) => {
                    setBugs({
                      count: 0,
                      bugs: [],
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
                  applyFilter={onFilterApply}
                  name={'status'}
                  label={'Status'}
                  isMulti
                  paramFilter={paramFilters?.status}
                  options={data?.statusOptions}
                  control={control}
                  onReset={handleResetStatusChip}
                />
                <FilterChip
                  isDisabled={!watch('assignedTo')?.length}
                  watch={watch}
                  applyFilter={onFilterApply}
                  name={'assignedTo'}
                  label={'Assigned to'}
                  isMulti
                  paramFilter={paramFilters?.assignedTo}
                  options={data?.assignedToOptions}
                  control={control}
                  onReset={handleResetAssignedToChip}
                />
                <FilterChip
                  isDisabled={!watch('bugType')?.length}
                  watch={watch}
                  applyFilter={onFilterApply}
                  name={'bugType'}
                  label={'Bug Type'}
                  isMulti
                  paramFilter={paramFilters?.bugType}
                  options={data?.bugTypeOptions}
                  control={control}
                  onReset={handleResetBugTypeChip}
                />
                <FilterChip
                  isDisabled={!watch('bugBy')?.length}
                  watch={watch}
                  applyFilter={onFilterApply}
                  name={'bugBy'}
                  label={'Developer (Bug By)'}
                  isMulti
                  paramFilter={paramFilters?.bugBy}
                  options={data?.bugByOptions}
                  control={control}
                  openLeft={true}
                  onReset={handleResetBugByChip}
                />
                <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                  <Button
                    btnClass={style.reportBtn}
                    text="Report Bug"
                    handleClick={handleReportBug}
                    data-cy="bug-reporting-starttesting-btn"
                  />
                </Permissions>
                <Permissions
                  allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                  currentRole={userDetails?.role}
                  locked={false}
                >
                  <div className={style.moreMenu} onClick={onClickMoreIcon}>
                    <Icon name={'MoreInvertIcon'} height={24} width={24} />
                    {open && (
                      <div className={style.modalDiv}>
                        <div onClick={onClickImportIcon} className={style.flexImport}>
                          <Icon name={'ImportIcon'} />
                          <p>Import Bugs</p>
                        </div>
                        <div className={style.flexImport} onClick={exportHandler}>
                          <Icon name={'ExportIcon'} />
                          <p>Export Bugs</p>
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
                <div onClick={onMenuIcon} className={style.position_relative}>
                  <Icon name={'MenuIcon'} />
                  {filtersCount > 0 && <div className={style.filterCountDot}>{filtersCount}</div>}
                </div>
                <div onClick={onThreeDots}>
                  <img src={threeDots} alt="" />
                </div>
              </div>
            </div>
            <div className={style.headerDivMobile}>
              <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
                <FilterHeader
                  paramFilters={paramFilters}
                  projectSpecific={projectId}
                  mobileView={true}
                  {...{
                    data,
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
                {bugs.count ? (
                  <>
                    <div className={style.mainClass}>
                      <h6>
                        {' '}
                        Bugs ({selectedRecords.length ? `${selectedRecords.length}/` : ''}
                        {bugs.count})
                      </h6>
                      <div className={style.secondMenu}>
                        {_every(selectedBugs, (bug) => bug['projectId']?._id === selectedBugs[0]['projectId']?._id) &&
                          selectedBugs.length > 1 && (
                            <Permissions
                              allowedRoles={['Admin', 'Project Manager', 'QA']}
                              currentRole={userDetails?.role}
                            >
                              {' '}
                              <div className={style.changeMain} onClick={onBulkEditBtn} data-cy="bug-bulk-edit-btn">
                                <p className={style.bulk_edit_text}>Bulk Edit</p>
                              </div>
                            </Permissions>
                          )}
                        {_every(selectedBugs, (bug) => bug['projectId']?._id === selectedBugs[0]['projectId']?._id) &&
                        selectedRecords.length > 0 ? (
                          <div onClick={onCreateTask} className={style.addTask}>
                            <Icon name={'CreateTask'} height={24} width={24} />
                          </div>
                        ) : null}
                        {_every(
                          selectedRunRecords,
                          (runRecord) => runRecord?.projectId?._id === selectedRunRecords[0]?.projectId?._id,
                        ) &&
                          selectedRunRecords.length > 0 && (
                            <div className={style.changeMain} src={run} alt="" onClick={onTestRunIcon}>
                              <div className={style.imgDelMain}>
                                <Icon name={'TestRunIcon'} height={24} width={24} />
                              </div>
                              <div className={style.tooltip}>
                                <p>Test Run</p>
                              </div>
                            </div>
                          )}
                        {selectedRecords.length ? (
                          <div onClick={onDeleteIcon} className={style.changeMain} id={'deleteButton'}>
                            <div className={style.imgDelMain}>
                              <Icon name={'Delete24'} height={24} width={24} />
                            </div>
                            <div className={style.tooltip}>
                              <p>Delete</p>
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <MobileMenu isOpen={isOpen2} setIsOpen={setIsOpen2}>
                        <div className={style.secondMenuMobile}>
                          {_every(selectedBugs, (bug) => bug['projectId']?._id === selectedBugs[0]['projectId']?._id) &&
                            selectedBugs.length > 1 && (
                              <Permissions
                                allowedRoles={['Admin', 'Project Manager', 'QA']}
                                currentRole={userDetails?.role}
                              >
                                <div onClick={onBulkEditBtn} className={style.change} id={'deleteButton'}>
                                  <p>Bulk Edit</p>
                                </div>
                              </Permissions>
                            )}
                          {selectedRecords.length ? (
                            <div onClick={onDeleteIcon} className={style.change} id={'deleteButton'}>
                              <div className={style.imgDel}>
                                <Icon name={'DelIcon'} />
                              </div>

                              <p>Delete</p>
                            </div>
                          ) : null}
                          {selectedRecords.length > 0 && projectId ? (
                            <div onClick={onPlusIcon} className={style.change}>
                              <Icon name={'PlusIcon'} />
                              <p>Task</p>
                            </div>
                          ) : null}
                        </div>
                      </MobileMenu>
                    </div>
                    <div className={style.tableWidth}>
                      <GenericTable
                        noHeader={noHeader}
                        setRightClickedRecord={setRightClickedRecord}
                        optionMenu={optionMenu}
                        menu={menu}
                        setMenu={setMenu}
                        menuData={menuData}
                        selectedItem={selectedRecords}
                        ref={containerRef}
                        columns={columnsData({
                          setSearchParams,
                          setOpenRetestModal,
                          setIsStartTesting,
                          openRetestModal,
                          control,
                          searchedText: filters?.search,
                          watch,
                          register,
                          setOpenCreateTicket,
                          setOpenDelModal,
                          openDelModal,
                          openCreateTicket,
                          setViewBugId,
                          setEditRecord,
                          setDuplicateRecord,
                          setSelectedRunRecords,
                          bugs: bugs?.bugs,
                          isHoveringName,
                          setIsHoveringName,
                          selectedRecords,
                          setSelectedRecords,
                          selectedBugs,
                          setSelectedBugs,
                          setRetestOpen,
                          role: userDetails?.role,
                          activePlan: userDetails?.activePlan,
                          onChangeSeverity,
                          noHeader,
                          setIsAddTestCase,
                        })}
                        dataSource={bugs?.bugs || []}
                        height={noHeader ? 'calc(100vh - 295px)' : 'calc(100vh - 205px)'}
                        filters={sortFilters}
                        onClickHeader={handleFilterChange}
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
                      {_isLoading && <Loader tableMode className={style.loaderClass} />}
                    </div>
                  </>
                ) : (
                  <div
                    className={style.no_data_container}
                    style={{
                      height: noHeader ? 'calc(100vh - 334px)' : 'calc(100vh - 338px)',
                    }}
                  >
                    <img src={noData} alt="" />
                  </div>
                )}
              </>
            )}
            {open && <div className={style.backdrop} onClick={onBackDropClick} />}
          </MainWrapper>
          <div className={style.flex1}>
            {viewBug && !addTestCase && (
              <>
                <ViewBug
                  setDuplicateRecord={setDuplicateRecord}
                  setIsAddTestCase={setIsAddTestCase}
                  setDrawerOpen={setViewBug}
                  viewBug={viewBug}
                  setViewBugId={setViewBugId}
                  setAddTestCase={setAddTestCase}
                  viewBugId={viewBugId}
                  allData={bugs?.bugs}
                  noHeader={noHeader}
                  setRetestOpen={setRetestOpen}
                  setViewBug={setViewBug}
                  setEditRecord={setEditRecord}
                  setOpenDelModal={setOpenDelModal}
                  setIsStartTesting={setIsStartTesting}
                  copyDataToClipboard={copyDataToClipboard}
                  setSelectedBugs={setSelectedBugs}
                  setOpenTaskModal={setOpenTaskModal}
                  selectedBugs={selectedBugs}
                  setSelectedRecords={setSelectedRecords}
                  selectedRunRecords={selectedRunRecords}
                  setViewTestRun={setViewTestRun}
                  setSelectedRunRecords={setSelectedRunRecords}
                />
              </>
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
            {(viewBug || viewTestRun) && <div id="splitpane" className={style.display_none} onClick={onSplitPane} />}
          </div>
        </SplitPane>
      </div>

      {/*NOTE: SIDE MODAL */}

      {allowFilterDrawer && !addTestCase && (
        <FiltersDrawer
          noHeader={noHeader}
          searchParams={bugId}
          setViewBug={setViewBug}
          setDrawerOpen={setAllowFilterDrawer}
          projectSpecific={projectId}
          mobileView={true}
          {...{
            data,
            control,
            register,
            watch,
            setValue,
            tagsOptions,
            reset: () => {
              reset({ ...initialFilters });
              setFilters(() => ({ ...initialFilters }));
              setBugs({
                count: 0,
                bugs: [],
              });
              setSortFilters({ sortBy: '', sort: '' });
              setIsOpen(false);
              setFiltersCount(0);
              setFiltersParams({});
            },
          }}
          isDirty={filtersCount > 0}
          onFilterApply={onFilterApply}
        />
      )}

      {/*NOTE: BASIC MODAL */}

      {isStartTesting.open && (
        <StartTestingModal
          open={isStartTesting.open}
          handleClose={handleCloseTestingModal}
          refetch={refetchHandler}
          projectId={projectId}
          editRecord={editRecord}
          setEditRecord={setEditRecord}
          duplicateRecord={duplicateRecord}
          setDuplicateRecord={setDuplicateRecord}
        />
      )}

      {isAddTestCase.open && (
        <AddTestCaseModal
          open={isAddTestCase.open}
          handleClose={handleCloseAddTestModal}
          refetch={refetchHandler}
          projectId={projectId}
          editRecord={editRecord}
          setEditRecord={setEditRecord}
        />
      )}

      {!!openDelModal.open && (
        <DeleteModal
          openDelModal={!!openDelModal.open}
          setOpenDelModal={handleCloseDelModal}
          name="bug"
          clickHandler={onDelete}
          cancelText="No, Keep it"
          isLoading={deletingBug}
        />
      )}

      {!!openTaskModal.open && (
        <CreateTaskModal
          setSelectedBugs={setSelectedBugs}
          bugsData={selectedBugs}
          isSubmitting={_createTaskIsLoading}
          submitHandlerTask={submitHandlerTask}
          isJiraSubmitting={_createJiraTaskIsLoading}
          setSelectedRunRecords={setSelectedRunRecords}
          submitHandlerJiraTask={submitHandlerJiraTask}
          openDelModal={!!openTaskModal.open}
          projectId={projectId}
          selectedRecords={selectedRecords}
          setSelectedRecords={setSelectedRecords}
          setOpenDelModal={handleCloseOpenDelModal}
        />
      )}

      {retestOpen && (
        <RetestModal
          openRetestModal={retestOpen}
          setOpenRetestModal={handleCloseRetestModal}
          options={data}
          refetch={refetchHandler}
        />
      )}

      {bulkEdit && (
        <BulkEditModal
          type={'bug'}
          open={bulkEdit}
          refetch={refetch}
          handleClose={handleCloseEditModal}
          projectId={projectId ? projectId : selectedBugs[0]['projectId']?._id}
          selectedRecords={selectedRecords}
          options={data}
          onSubmit={onBulkEdit}
          isLoading={_isBulkEditLoading}
        />
      )}
    </>
  );
};

export default QaTesting;
