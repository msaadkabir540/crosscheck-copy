import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { useAppContext } from 'context/app-context';

import Button from 'components/button';
import GenericTable from 'components/generic-table';
import MainWrapper from 'components/layout/main-wrapper';
import DeleteModal from 'components/delete-modal';
import SplitPane from 'components/split-pane/split-pane';
import TextField from 'components/text-field';
import Permissions from 'components/permissions';
import Loader from 'components/loader';
import MobileMenu from 'components/mobile-menu';
import FilterChip from 'components/filter-chip';

import { useToaster } from 'hooks/use-toaster';

import {
  useChangePriorityTestRun,
  useDeleteTestRun,
  useExportTestRuns,
  useGetTestRunsByFilter,
  useCloseTestRuns,
} from 'api/v1/test-runs/test-runs';

import { downloadCSV } from 'utils/file-handler';
import { formattedDate } from 'utils/date-handler';

import threeDots from 'assets/threeDots.svg';
import clearIcon from 'assets/cross.svg';
import search from 'assets/search.svg';

import FiltersDrawer from './filters-drawer';
import CloseTestRun from './single-test-run/close-test-run';
import Drawer from './drawer';
import WarningTestRun from './single-test-run/warning-test-run';
import { columnsData, initialFilter, menuData, useProjectOptions } from './helper';
import ColumnModal from './choose-columns-modal';
import FilterHeader from './header';
import style from './test-runs.module.scss';
import DateRange from '../../components/date-range';
import Icon from '../../components/icon/themed-icon';

const filterNames = [
  'search',
  'status',
  'page',
  'assignedTo',
  'dueDate',
  'createdAt',
  'createdBy',
  'perPage',
  'projectId',
];

const TestRuns = ({ noHeader, projectId }) => {
  const { control, register, watch, reset, setValue } = useForm();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const [choseColModal, setChoseColModal] = useState(false);
  const { data = {} } = useProjectOptions();

  const [loadingMore, setLoadingMore] = useState(false);
  const { userDetails } = useAppContext();
  const [delModal, setDelModal] = useState(false);
  const [openRetestModal, setOpenRetestModal] = useState(false);
  const [openDelModal] = useState(false);
  const [warning, setWarning] = useState({ open: false, msg: '' });
  const [closeId, setCloseId] = useState('');

  const [openCreateTicket, setOpenCreateTicket] = useState(false);
  const [allowResize, setAllowResize] = useState(false);
  const [allowFilterDrawer, setAllowFilterDrawer] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [duplicate, setDuplicate] = useState(null);
  const [filtersCount, setFiltersCount] = useState(0);

  const [filters, setFilters] = useState({
    ...initialFilter,
    projectId: projectId ? [projectId] : [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [testRuns, setTestRuns] = useState({});
  const [menu, setMenu] = useState(false);
  const [closeTestRun, setCloseTestRun] = useState(false);

  const { toastSuccess, toastError } = useToaster();
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [isHoveringName, setIsHoveringName] = useState({});
  const [rightClickedRecord, setRightClickedRecord] = useState({});
  const [filtersParams, setFiltersParams] = useSearchParams();
  const [sizes, setSizes] = useState(['20%', 'auto']);
  const WATCH_DUEDATE_END = watch('dueDate')?.end;

  useEffect(() => {
    if (allowResize) {
      if (window.innerWidth <= 768) {
        setSizes(['0%', '100%']);
      } else {
        setSizes(['65%', '35%']);
      }
    } else {
      setSizes(['100%', '0%']);
    }
  }, [allowResize]);

  const [sortFilters, setSortFilters] = useState({
    sortBy: '',
    sort: '',
  });
  const add = searchParams.get('add');

  const { mutateAsync: _closeTestRunHandler, isLoading: _isCloseLoading } = useCloseTestRuns();

  const paramFilters = useMemo(() => {
    const result = {};

    for (const paramName of filterNames) {
      if (paramName === 'search') {
        result[paramName] = filtersParams?.get(paramName) || '';
      } else if (['dueDate', 'createdAt']?.includes(paramName)) {
        result[paramName] = {
          start: filtersParams?.get(`${paramName}.start`) || '',
          end: filtersParams?.get(`${paramName}.end`) || '',
        };
      } else {
        result[paramName] = filtersParams?.getAll(paramName) || [];
      }
    }

    if (!result?.dueDate?.start && !result?.dueDate?.end) {
      delete result.dueDate;
    }

    if (!result?.createdAt?.start && !result?.createdAt?.end) {
      delete result.createdAt;
    }

    return {
      ...result,
      search: filters?.search,
      page: filters?.page,
      perPage: 25,
    };
  }, [filters?.search, filters?.page, filtersParams]);

  const projectInitialFilter = useMemo(() => {
    return {
      search: '',
      status: [],
      assignedTo: [],
      createdBy: [],
      projectId: projectId ? [projectId] : [],
      createdAt: {
        start: null,
        end: null,
      },
      dueDate: {
        start: null,
        end: null,
      },
      page: 1,
      perPage: 25,
    };
  }, [projectId]);

  useEffect(() => {
    if (add === 'true') {
      setAllowResize(true);
    }
  }, [add]);

  const countAppliedFilters = () => {
    let count = 0;

    if (watch('status')?.length > 0) {
      count++;
    }

    if (watch('assignedTo')?.length > 0) {
      count++;
    }

    if (watch('dueDate')?.start !== null && watch('dueDate')?.start !== undefined && watch('dueDate')?.start !== '') {
      count++;
    }

    if (
      watch('createdAt')?.start !== null &&
      watch('createdAt')?.start !== undefined &&
      watch('createdAt')?.start !== ''
    ) {
      count++;
    }

    if (watch('createdBy')?.length > 0) {
      count++;
    }

    return setFiltersCount(count);
  };

  const onChangeDate = useCallback(
    (dates) => {
      const [start, end] = dates;

      setValue('dueDate', { start, end });
    },
    [setValue],
  );

  const { mutateAsync: _getAllTestRuns, isLoading: _isLoading } = useGetTestRunsByFilter();
  const CONTAINERREF_CURRENT = containerRef?.current;

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = containerRef.current;

    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (testRuns?.count !== testRuns?.testruns?.length && !_isLoading) {
        CONTAINERREF_CURRENT?.removeEventListener('scroll', handleScroll);

        setFilters((prev) => ({ ...prev, page: prev?.page + 1, projectId: projectId ? [projectId] : [] }));
        // NOTE: Scroll up by 10 pixels from the last scroll position
        containerRef.current.scrollTo(scrollLeft, scrollTop - 10);
      }
    }
  }, [_isLoading, projectId, testRuns?.count, testRuns?.testruns?.length, CONTAINERREF_CURRENT]);

  useEffect(() => {
    const currentContainer = containerRef.current;

    if (containerRef.current && !_isLoading) {
      currentContainer?.addEventListener('scroll', handleScroll);
    }

    return () => {
      !_isLoading ? currentContainer?.removeEventListener('scroll', handleScroll) : () => {};
    };
  }, [containerRef, _isLoading, handleScroll]);

  // NOTE: get users on frontend as per search query
  const handleFilterChange = _.debounce(({ sortBy = '', sort = '' }) => {
    setFilters((pre) => ({ ...pre, page: 1 }));
    setSortFilters((pre) => ({
      ...pre,
      sortBy,
      sort,
    }));
  }, 1000);

  const { mutateAsync: _deleteTestRunHandler, isLoading: isDeleting } = useDeleteTestRun();

  const refetchHandler = useCallback(
    (id, scenario, newData) => {
      const index = id && scenario !== 'delete' ? testRuns?.testruns?.findIndex((x) => x._id === id) : -1;

      if (scenario === 'add') {
        setTestRuns((pre) => {
          const currentTestruns = pre.testruns || [];
          const newCount = (pre.count || 0) + 1;
          const newTestruns = newCount <= 25 * filters.page ? [...currentTestruns, newData] : currentTestruns;

          return {
            ...pre,
            count: newCount,
            testruns: newTestruns,
          };
        });
      } else if (id && scenario === 'edit' && index !== -1) {
        setTestRuns((pre) => {
          const updatedTestRuns = pre.testruns.map((run, i) => (i === index ? newData : run));

          return { ...pre, testruns: updatedTestRuns };
        });
      } else if (scenario === 'delete' && Array.isArray(id) && id.length) {
        setTestRuns((pre) => {
          const updatedTestRuns = pre.testruns.filter((run) => !id.includes(run._id));

          return {
            ...pre,
            count: (pre.count || 0) - id.length,
            testruns: updatedTestRuns,
          };
        });
      }
    },
    [filters, testRuns],
  );

  const onDelete = useCallback(async () => {
    try {
      const bulk = delModal.bulk;

      const res = await _deleteTestRunHandler({
        body: {
          toDelete: bulk ? selectedRecords : [delModal?.id],
        },
      });
      toastSuccess(res.msg);
      refetchHandler(bulk ? selectedRecords : [delModal?.id], 'delete');
      setDelModal(() => ({ open: false }));
      bulk && setSelectedRecords([]);
    } catch (error) {
      toastError(error);
    }
  }, [_deleteTestRunHandler, delModal, refetchHandler, selectedRecords, toastError, toastSuccess]);

  // NOTE: onFilter Apply
  const onFilterApply = _.debounce(() => {
    setTestRuns({
      count: 0,
      testruns: [],
    });

    setFilters((pre) => ({
      ...pre,
      page: 1,
      projectId: projectId ? [projectId] : [],
      ...(watch('search') && { search: watch('search') }),
      ...(watch('status') && { status: watch('status') || [] }),
      ...(watch('assignedTo') && { assignedTo: watch('assignedTo') || [] }),
      ...(watch('dueDate') &&
        watch('dueDate.start') &&
        watch('dueDate.end') && {
          dueDate: {
            start: formattedDate(watch('dueDate.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('dueDate.end'), 'yyyy-MM-dd'),
          },
        }),
      ...(watch('createdAt') &&
        watch('createdAt.start') &&
        watch('createdAt.end') && {
          createdAt: {
            start: formattedDate(watch('createdAt.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('createdAt.end'), 'yyyy-MM-dd'),
          },
        }),
      ...(watch('createdBy') && { createdBy: watch('createdBy') || [] }),
    }));

    if (filterNames) {
      const filterObject = filterNames.reduce(
        (acc, filterName) => {
          const filterValue = watch(filterName);

          if (filterValue !== undefined && filterValue !== null) {
            if (filterName === 'dueDate' || filterName === 'createdAt') {
              const startDate = watch(`${filterName}.start`);
              const endDate = watch(`${filterName}.end`);

              if (startDate && endDate) {
                acc[`${filterName}.start`] = formattedDate(startDate, 'yyyy-MM-dd');
                acc[`${filterName}.end`] = formattedDate(endDate, 'yyyy-MM-dd');
              }
            } else {
              acc[filterName] = Array.isArray(filterValue) ? filterValue : [filterValue];
            }
          }

          return acc;
        },
        noHeader ? { active: 3 } : {},
      );

      setFiltersParams(filterObject);
    } else {
      console.error('filterNames is undefined');
    }

    countAppliedFilters();
    setIsOpen(false);
    setAllowFilterDrawer(false);
  }, 1000);

  useEffect(() => {
    if (!allowFilterDrawer && watch('dueDate')?.end) {
      onFilterApply();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [WATCH_DUEDATE_END]);

  const fetchTestRuns = useCallback(
    async (filters) => {
      try {
        setLoadingMore(true);
        const response = await _getAllTestRuns({ ...filters, ...sortFilters });
        setTestRuns((prev) => ({
          ...(prev || {}),
          count: response?.count || 0,
          testruns:
            filters?.page === 1 ? response?.testruns || [] : [...(prev.testruns || []), ...(response?.testruns || [])],
        }));

        setLoadingMore(false);
      } catch (error) {
        setLoadingMore(false);
        toastError(error);
      }
    },
    [_getAllTestRuns, toastError, sortFilters],
  );

  const { mutateAsync: _exportTestRuns } = useExportTestRuns();

  const exportHandler = useCallback(async () => {
    try {
      const res = await _exportTestRuns({
        ...filters,
        page: 0,
      });

      if (res) {
        downloadCSV(res, `TestRuns Export File ${new Date()}`);
      }

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }, [_exportTestRuns, filters]);

  useEffect(() => {
    const _values = _.pick(Object.fromEntries([...searchParams]), [
      'reportedBy',
      'reportedAtStart',
      'reportedAtEnd',
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

    delete _values.reportedBy;
    delete _values.reportedAtStart;
    delete _values.reportedAtEnd;

    Object.entries(_values).forEach(([key, val]) => {
      setValue(key, val);
    });
  }, [searchParams, setValue]);

  const refetch = useCallback(() => {
    const searchParams = {
      ...(watch('search') && { search: watch('search') }),
      projectId: projectId ? [projectId] : [],
    };

    const dateParams = {
      ...(watch('createdAt.start') &&
        watch('createdAt.end') && {
          createdAt: {
            start: formattedDate(watch('createdAt.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('createdAt.end'), 'yyyy-MM-dd'),
          },
        }),
    };
    fetchTestRuns(
      paramFilters
        ? {
            ...paramFilters,
            ...(watch('search') && { search: watch('search') }),
            ...searchParams,
          }
        : {
            ...filters,
            ...searchParams,
            ...(watch('createdBy') && { createdBy: watch('createdBy') }),
            ...(watch('status') && { status: watch('status') }),
            ...dateParams,
          },
    );
  }, [fetchTestRuns, filters, paramFilters, projectId, watch]);

  useEffect(() => {
    refetch();
  }, [filters, refetch, sortFilters]);

  const { mutateAsync: _changePriorityHandler } = useChangePriorityTestRun();

  const onChangePriority = async (id, value) => {
    try {
      const res = await _changePriorityHandler({ id, body: { newPriority: value } });
      refetchHandler(id, 'edit', res?.runData);
      toastSuccess(res.msg);
    } catch (error) {
      toastError(error);
    }
  };

  const optionMenu = [
    {
      border: '1px solid #d6d6d6',
      bodyData: [
        {
          click: (e) => {
            e.preventDefault();
            setAllowResize(!allowResize);
            setEditRecord(rightClickedRecord?._id);
          },
          icon: <Icon name={'EditIconGrey'} iconClass={style.editColor} />,
          text: 'Edit',
        },
      ],
    },
    {
      border: '1px solid #d6d6d6',
      bodyData: [
        {
          click: (e) => {
            e.preventDefault();
            setAllowResize(!allowResize);
            setEditRecord(rightClickedRecord?._id);
            setDuplicate(true);
          },
          icon: <Icon name={'Duplicate'} iconClass={style.editColor} />,
          text: 'Duplicate Run',
        },
      ],
    },
    {
      border: '1px solid #d6d6d6',
      bodyData: [
        {
          click: (e) => {
            e.preventDefault();
            setCloseTestRun(true);
            setCloseId(rightClickedRecord?._id);
          },
          icon: <Icon name={'TickCircle'} iconClass={style.editColor} />,
          text: 'Close Run',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () =>
            setDelModal({
              open: true,
              name: rightClickedRecord?.runId,
              id: rightClickedRecord?._id,
            }),
          icon: <Icon name={'DelRedIcon'} iconClass={style.editColor1} />,
          text: 'Delete',
        },
      ],
    },
  ];

  const handleShowFilterDrawer = useCallback(() => {
    setAllowFilterDrawer(!allowFilterDrawer);
    setAllowResize(false);
  }, [allowFilterDrawer]);

  const handleResetChip = useCallback(
    (type) => {
      setValue(type, []);

      setFiltersParams({ ...paramFilters, [type]: [] });
    },
    [paramFilters, setFiltersParams, setValue],
  );

  const handleResetStatus = useCallback(() => {
    handleResetChip('status');
  }, [handleResetChip]);

  const handleResetAssignTo = useCallback(() => {
    handleResetChip('assignedTo');
  }, [handleResetChip]);

  const handleFilterDrawerClose = useCallback(() => {
    setAllowResize(!allowResize);
    setAllowFilterDrawer(false);
  }, [allowResize]);

  const handleMoreIcon = useCallback(() => {
    setOpen(true);
  }, []);

  const handleMoreIconClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleMore2Icon = useCallback(() => {
    setIsOpen2(true);
  }, []);

  const handleChoseColModalTrue = useCallback(() => {
    setChoseColModal(true);
  }, []);

  const handleChoseDelModal = useCallback(() => {
    setDelModal({ open: false });
  }, []);

  const handleSplitPane = useCallback(() => {
    setAllowResize(false);
    setEditRecord(null);
  }, []);

  const handleWarningClose = useCallback(() => {
    setWarning({ open: false, msg: '' });
  }, []);

  const handleOnDel = useCallback((e) => onDelete(e, delModal.bulk), [delModal.bulk, onDelete]);

  const handleBulkDelBtn = useCallback(
    () =>
      selectedRecords.length > 0
        ? setDelModal({ open: true, bulk: true })
        : toastError({
            msg: 'Select Test Cases to delete',
          }),
    [selectedRecords.length, toastError],
  );

  const handleResetMobile = useCallback(() => {
    reset(projectId ? { ...projectInitialFilter } : { ...initialFilter });
    setFilters(() => (projectId ? { ...projectInitialFilter } : { ...initialFilter }));
    setTestRuns({
      count: 0,
      testruns: [],
    });
    setSortFilters({ sortBy: '', sort: '' });
    setFiltersCount(0);
    setFiltersParams({});
  }, [projectId, projectInitialFilter, reset, setFiltersParams]);

  const handleResetDueDate = useCallback(
    (e) => {
      e.stopPropagation();
      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          dueDate: {
            start: null,
            end: null,
          },
        };

        if (!updatedFilters.dueDate.start && !updatedFilters.dueDate.end) {
          delete updatedFilters.dueDate;
        }

        return updatedFilters;
      });
      setFiltersParams((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          dueDate: {
            start: null,
            end: null,
          },
        };

        if (!updatedFilters.dueDate.start && !updatedFilters.dueDate.end) {
          delete updatedFilters.dueDate;
        }

        return updatedFilters;
      });

      setTestRuns({
        count: 0,
        testruns: [],
      });
      setSortFilters({ sortBy: '', sort: '' });
      setFiltersCount(filtersCount - 1);
      setValue('dueDate', '');
    },
    [filtersCount, setFiltersParams, setValue],
  );

  const closeHandler = useCallback(async () => {
    try {
      const res = await _closeTestRunHandler(closeId);
      setCloseTestRun(false);
      refetch();
      toastSuccess(res?.msg);
      setCloseId('');
    } catch (error) {
      setCloseTestRun(false);
      error?.msg?.includes('not tested') && setWarning({ open: true, msg: error.msg });
      !error?.msg?.includes('not tested') && toastError(error);
    }
  }, [_closeTestRunHandler, closeId, refetch, toastError, toastSuccess]);

  const countNonEmptyElements = useCallback(
    (data) => {
      let count = 0;

      for (let key in data) {
        if (key === 'page' || key === 'perPage' || key === 'search' || (noHeader && key === 'projectId')) {
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

  return (
    <>
      <div className={style.overflowClass} style={{ height: !noHeader ? '100vh' : '85vh' }}>
        <SplitPane sizes={sizes} onChange={setSizes} allowResize={allowResize}>
          <MainWrapper
            title={'Test Runs'}
            date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
            stylesBack={noHeader ? { marginTop: '10px' } : {}}
            noHeader={noHeader}
          >
            <div className={style.functional}>
              <div className={`${style.mainClass} ${style.heightClass}`}>
                <div className={style.exportDiv}>
                  <Button
                    startCompo={filtersCount > 0 ? <Icon name={'FilterIconOrange'} /> : <Icon name={'FilterIcon'} />}
                    text={`Filters ${filtersCount ? `(${filtersCount})` : ''}`}
                    btnClass={filtersCount > 0 ? style.filterBtnActive : style.filterBtn}
                    handleClick={handleShowFilterDrawer}
                    data-cy="testrun-filter-btn"
                  />
                  <TextField
                    searchField
                    icon={search}
                    name={'search'}
                    clearIcon={clearIcon}
                    startIconClass={style.startIcon}
                    placeholder="Type and search..."
                    onClear={_.debounce(() => {
                      setTestRuns({
                        count: 0,
                        testruns: [],
                      });
                      setFilters((pre) => ({ ...pre, page: 1, search: '' }));
                    }, 1000)}
                    onChange={_.debounce((e) => {
                      setTestRuns({
                        count: 0,
                        testruns: [],
                      });
                      setFilters((pre) => ({ ...pre, page: 1, search: e.target.value }));
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
                    options={data?.statusOptions}
                    paramFilter={paramFilters?.status}
                    control={control}
                    onReset={handleResetStatus}
                  />
                  <FilterChip
                    isDisabled={!watch('assignedTo')?.length}
                    watch={watch}
                    applyFilter={onFilterApply}
                    label={'Assigned To'}
                    name={'assignedTo'}
                    isMulti
                    paramFilter={paramFilters?.assignedTo}
                    options={data?.assignedTo}
                    control={control}
                    onReset={handleResetAssignTo}
                  />
                  <div
                    className={style.flexDate}
                    style={{
                      backgroundColor: watch('dueDate')?.end && '#E25E3E33',
                      borderColor: watch('dueDate')?.end && '#E25E3E',
                    }}
                  >
                    <div
                      className={style.chipFlex}
                      style={{
                        backgroundColor: watch('dueDate')?.end && '#E25E3E33',
                        zIndex: watch('dueDate')?.end && '20',
                      }}
                    >
                      <h4
                        style={{
                          color: watch('dueDate')?.end && '#E25E3E',
                        }}
                      >
                        Due Date
                      </h4>
                      {watch('dueDate')?.end && (
                        <div onClick={handleResetDueDate} className={style.iconDiv}>
                          <Icon name={'CrossAttachment'} iconClass={style.orangeIcon} />
                        </div>
                      )}
                    </div>
                    <DateRange
                      handleChange={onChangeDate}
                      startDate={watch('dueDate')?.start}
                      endDate={watch('dueDate')?.end}
                      name={'dueDate'}
                      placeholder={'Select'}
                      control={control}
                      className={style.customDateStyle}
                    />
                  </div>

                  <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                    <Button
                      text="Add Test Run"
                      handleClick={handleFilterDrawerClose}
                      data-cy="testrun-addtestrun-btn"
                    />
                  </Permissions>
                  <Permissions
                    allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                    currentRole={userDetails?.role}
                    locked={userDetails?.activePlan === 'Free'}
                  >
                    <div className={style.moreMenu} onClick={handleMoreIcon}>
                      <Icon name={'MoreInvertIcon'} height={24} width={24} />
                      {open && (
                        <div className={style.modalDiv}>
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
                      <span onClick={handleResetMobile}>Reset Filters</span>{' '}
                    </div>
                  )}
                  <div className={style.relative} onClick={handleMoreIcon}>
                    <Icon name={'MenuIcon'} />
                    {filtersCount > 0 && <div className={style.filterCountDot}>{filtersCount}</div>}
                  </div>
                  <div onClick={handleMore2Icon}>
                    <img src={threeDots} alt="" />
                  </div>
                </div>
              </div>

              <div className={style.headerDivMobile}>
                <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
                  <FilterHeader
                    paramFilters={paramFilters}
                    mobileView
                    {...{
                      control,
                      register,
                      watch,
                      setValue,
                      reset: () => {
                        reset({ ...initialFilter });
                        setFilters(() => ({ ...initialFilter }));
                        setTestRuns({
                          count: 0,
                          testruns: [],
                        });
                        setSortFilters({ sortBy: '', sort: '' });
                        setFiltersCount(0);
                        setFiltersParams({});
                      },
                    }}
                    onFilterApply={onFilterApply}
                  />
                </MobileMenu>
              </div>
              <>
                <div className={`${style.mainClass} ${style.margin}`}>
                  <h6>
                    Test Runs ({selectedRecords.length ? `${selectedRecords.length}/` : ''}
                    {testRuns?.count})
                  </h6>
                  <div className={style.secondMenu}>
                    {selectedRecords.length ? (
                      <div
                        id={'deleteButton'}
                        className={`${style.change} ${style.delChange}`}
                        onClick={handleBulkDelBtn}
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
                  <MobileMenu isOpen={isOpen2} setIsOpen={setIsOpen2}>
                    <div className={style.secondMenuMobile}>
                      {selectedRecords.length ? (
                        <div id={'deleteButton'} className={style.change} onClick={handleBulkDelBtn}>
                          <div className={style.imgDel}>
                            <Icon name={'DelIcon'} />
                          </div>
                          <p>Delete</p>
                        </div>
                      ) : null}
                      <div id={'columnChange'} alt="" onClick={handleChoseColModalTrue} className={style.change}></div>
                      <div className={style.change}>
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
                      </div>
                    </div>
                  </MobileMenu>
                </div>
                {_isLoading && filters?.page < 2 ? (
                  <Loader />
                ) : (
                  <div className={style.tableWidth}>
                    <GenericTable
                      setRightClickedRecord={setRightClickedRecord}
                      menu={menu}
                      setMenu={setMenu}
                      menuData={menuData}
                      selectedItem={selectedRecords}
                      ref={containerRef}
                      optionMenu={optionMenu}
                      noHeader={noHeader}
                      columns={columnsData({
                        testRuns: testRuns?.testruns,
                        setSelectedRecords,
                        selectedRecords,
                        setOpenRetestModal,
                        openRetestModal,
                        setEditRecord,
                        allowResize,
                        control,
                        watch,
                        setAllowResize,
                        register,
                        searchedText: filters?.search,
                        setOpenCreateTicket,
                        navigate,
                        setDelModal,
                        isHoveringName,
                        setIsHoveringName,
                        openDelModal,
                        openCreateTicket,
                        noHeader,
                        searchParams,
                        setSearchParams,
                        role: userDetails?.role,
                        userDetails,
                        onChangePriority,
                        setDuplicate,
                      })}
                      nonSortingColumnKeys={['testedCount']}
                      dataSource={testRuns?.testruns || []}
                      height={noHeader ? 'calc(100vh - 295px)' : 'calc(100vh - 205px)'}
                      selectable={true}
                      filters={sortFilters}
                      onClickHeader={handleFilterChange}
                      classes={{
                        test: style.test,
                        table: style.table,
                        thead: style.thead,
                        th: style.th,
                        containerClass: style.checkboxContainer,
                        tableBody: style.tableRow,
                      }}
                    />
                    {loadingMore && <Loader tableMode className={style.loaderClass} />}
                  </div>
                )}
                <ColumnModal
                  choseColModal={choseColModal}
                  setChoseColModal={setChoseColModal}
                  columns={columnsData({
                    setOpenRetestModal,
                    openRetestModal,
                    control,
                    watch,
                    register,
                    setOpenCreateTicket,
                    openCreateTicket,
                  })}
                />
                <DeleteModal
                  openDelModal={!!delModal.open}
                  setOpenDelModal={handleChoseDelModal}
                  name={'Test Run'}
                  clickHandler={handleOnDel}
                  isLoading={isDeleting}
                />
              </>
            </div>
            {open && <div className={style.backdrop} onClick={handleMoreIconClose} />}
          </MainWrapper>
          <div className={style.flex1}>
            {allowResize && !allowFilterDrawer && (
              <Drawer
                setSelectedRunRecords={setSelectedRecords}
                setDrawerOpen={setAllowResize}
                editRecord={editRecord}
                setEditRecord={setEditRecord}
                refetch={refetchHandler}
                drawerOpen={allowResize}
                noHeader={noHeader}
                projectId={projectId}
                duplicate={duplicate}
                setDuplicate={setDuplicate}
              />
            )}
            {allowResize && <div className={style.none} id="splitpane" onClick={handleSplitPane} />}
          </div>
        </SplitPane>
      </div>

      {/*NOTE: SIDE MODAL */}

      {allowFilterDrawer && !allowResize && (
        <FiltersDrawer
          noHeader={noHeader}
          setDrawerOpen={setAllowFilterDrawer}
          {...{
            control,
            register,
            watch,
            setValue,
            reset: () => {
              reset(projectId ? { ...projectInitialFilter } : { ...initialFilter });
              setFilters(() => (projectId ? { ...projectInitialFilter } : { ...initialFilter }));
              setTestRuns({
                count: 0,
                testruns: [],
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

      {closeTestRun && (
        <CloseTestRun
          closeTestRun={closeTestRun}
          setCloseTestRun={setCloseTestRun}
          clickHandler={closeHandler}
          _isCloseLoading={_isCloseLoading}
        />
      )}
      {warning.open && (
        <WarningTestRun closeTestRun={warning?.open} setCloseTestRun={handleWarningClose} msg={warning?.msg} />
      )}
    </>
  );
};

TestRuns.propTypes = {
  noHeader: PropTypes.bool.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default TestRuns;
