import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

import GenericTable from 'components/generic-table';
import MainWrapper from 'components/layout/main-wrapper';
import Button from 'components/button';
import Loader from 'components/loader';
import TextField from 'components/text-field';
import MobileMenu from 'components/mobile-menu';
import DeleteModal from 'components/delete-modal-forever';

import { useToaster } from 'hooks/use-toaster';

import { useGetTasksByFilter, useDeleteClickUpTask } from 'api/v1/task/task';

import { formattedDate } from 'utils/date-handler';
import { debounce as _debounce } from 'utils/lodash';

import clearIcon from 'assets/cross.svg';

import FiltersDrawer from './filters-drawer';
import FilterHeader from './header';
import style from './tasks.module.scss';
import { columnsData, initialFilter } from './helper';
import CreateTaskEditModal from './task-edit-modal';
import Icon from '../../../../components/icon/themed-icon';

const Tasks = ({ noHeader, projectId }) => {
  const containerRef = useRef(null);
  const [tasks, setTasks] = useState({});
  const { toastSuccess, toastError } = useToaster();
  const [filters, setFilters] = useState(initialFilter);
  const [filtersCount, setFiltersCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { control, register, watch, reset, setValue } = useForm();
  const [isHoveringName, setIsHoveringName] = useState({});
  const [allowResize, setAllowResize] = useState(false);
  const [, setSizes] = useState(['20%', 'auto']);
  const [isOpen2, setIsOpen2] = useState(false);
  const [openDelModal, setOpenDelModal] = useState({ open: false, id: '' });
  const [editRecord, setEditRecord] = useState({ open: false, id: '' });
  const [filtersParams, setFiltersParams] = useSearchParams();

  const [sortFilters, setSortFilters] = useState({
    sortBy: '',
    sort: '',
  });

  const paramFilters = useMemo(() => {
    const result = {};

    for (const paramName of filterNames) {
      if (['createdAt']?.includes(paramName)) {
        result[paramName] = {
          start: filtersParams?.get(`${paramName}.start`) || null,
          end: filtersParams?.get(`${paramName}.end`) || null,
        };
      } else {
        result[paramName] = filtersParams?.getAll(paramName) || [];
      }
    }

    if (!result?.createdAt?.start && !result?.createdAt?.end) {
      delete result.createdAt;
    }

    return {
      ...result,
      createdAt: result?.createdAt,
      perPage: 25,
    };
  }, [filtersParams]);

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

  const handleResetFilters2 = useCallback(() => {
    reset({ ...initialFilter });
    setFilters(() => ({ ...initialFilter }));
    setIsOpen(false);
    setFiltersCount(0);
    setFiltersParams({});
  }, [reset, setFilters, setIsOpen, setFiltersCount, setFiltersParams]);

  const { mutateAsync: _getAllTasks, isLoading: _isLoading } = useGetTasksByFilter();

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = containerRef.current;

    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (tasks?.tasksCount !== tasks?.tasks.length && !_isLoading) {
        containerRef?.current?.removeEventListener('scroll', handleScroll);

        setFilters((prev) => ({ ...prev, page: prev?.page + 1 }));
        // NOTE: Scroll up by 10 pixels from the last scroll position
        containerRef.current.scrollTo(scrollLeft, scrollTop - 10);
      }
    }
  }, [_isLoading, tasks]);

  useEffect(() => {
    const container = containerRef?.current;

    if (!_isLoading) {
      container?.addEventListener('scroll', handleScroll);
    } else if (_isLoading) {
      container?.removeEventListener('scroll', handleScroll);
    }

    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, tasks, _isLoading, handleScroll]);

  const countAppliedFilters = () => {
    let count = 0;

    if (watch('applicationType')?.length > 0) {
      count++;
    }

    if (watch('taskType')?.length > 0) {
      count++;
    }

    if (watch('crossCheckAssignee')?.length > 0) {
      count++;
    }

    if (watch('createdBy')?.length > 0) {
      count++;
    }

    if (watch('createdAt')?.start !== null && watch('createdAt')?.start !== undefined) {
      count++;
    }

    return setFiltersCount(count);
  };

  // NOTE: onFilter Apply
  const onFilterApply = _debounce(() => {
    setTasks({
      count: 0,
      tasks: [],
    });
    setFilters((pre) => ({
      ...pre,
      page: 1,
      ...(watch('applicationType') && {
        applicationType: watch('applicationType') || [],
      }),
      ...(watch('taskType') && { taskType: watch('taskType') || [] }),
      ...(watch('createdAt') &&
        watch('createdAt.start') &&
        watch('createdAt.end') && {
          createdAt: {
            start: formattedDate(watch('createdAt.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('createdAt.end'), 'yyyy-MM-dd'),
          },
        }),
      ...(watch('createdBy') && { createdBy: watch('createdBy') || [] }),
      ...(watch('crossCheckAssignee') && {
        crossCheckAssignee: watch('crossCheckAssignee') || [],
      }),
    }));

    const filterObject = filterNames?.reduce(
      (acc, filterName) => {
        const filterValue = watch(filterName);

        if (filterValue !== undefined && filterValue !== null) {
          if (filterName === 'createdAt') {
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
      { active: 5 },
    );

    setFiltersParams(filterObject);
    countAppliedFilters();
    setAllowResize(false);
    setIsOpen(false);
  }, 1000);

  // NOTE: fetching TextRuns
  const fetchTasks = useCallback(
    async (filters) => {
      try {
        const response = await _getAllTasks({
          id: projectId,
          filters,
        });
        setTasks((pre) => ({
          ...(pre || {}),
          tasksCount: response?.tasksCount || 0,
          tasks: filters.page === 1 ? response?.tasks : [...(pre.tasks || []), ...(response?.tasks || [])],
        }));
      } catch (error) {
        toastError(error);
      }
    },
    [_getAllTasks, projectId, setTasks, toastError],
  );

  useEffect(() => {
    fetchTasks(
      paramFilters
        ? { search: filters?.search, ...paramFilters, page: filters?.page, ...sortFilters }
        : { ...filters, ...sortFilters },
    );
  }, [filters, paramFilters, fetchTasks, sortFilters]);

  const handleSortFilters = _.debounce(({ sortBy = '', sort = '' }) => {
    setFilters((pre) => ({ ...pre, page: 1 }));
    setSortFilters((pre) => ({
      ...pre,
      sortBy,
      sort,
    }));
  }, 1000);

  const { mutateAsync: _deleteTaskHandler, isLoading: _isDeleteLoading } = useDeleteClickUpTask();

  const onDeleteHandler = useCallback(async () => {
    try {
      const res = await _deleteTaskHandler({
        id: openDelModal.id,
        body: { forceDelete: !!openDelModal?.forceDelete },
      });
      toastSuccess(res.msg);

      setOpenDelModal({ open: false, id: '' });
      await fetchTasks(filters);
    } catch (error) {
      if (error.msg === 'Task not deleted from ClickUp as integration not found') {
        setOpenDelModal((pre) => ({ ...pre, forceDelete: true }));
      }

      toastError(error);
    }
  }, [_deleteTaskHandler, fetchTasks, filters, openDelModal, toastError, toastSuccess]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleOpen2 = useCallback(() => {
    setIsOpen2(true);
  }, [setIsOpen2]);

  const toggleResize = useCallback(() => {
    setAllowResize((prevAllowResize) => !prevAllowResize);
  }, [setAllowResize]);

  const handleSearchChange = _debounce((e) => {
    setTasks({
      tasksCount: 0,
      tasks: [],
    });
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: 1,
      search: e?.target?.value,
    }));
  }, 1000);

  const handleClear = _debounce(() => {
    setTasks({
      tasksCount: 0,
      tasks: [],
    });
    setFilters((pre) => ({ ...pre, page: 1, search: '' }));
  }, 1000);

  const handleExportError = useCallback(() => {
    toastError({ msg: 'No Data available to export' });
  }, [toastError]);

  const handleCloseDeleteModal = useCallback(() => {
    setOpenDelModal({ open: false, id: '' });
  }, [setOpenDelModal]);

  const handleCloseEditRecord = useCallback(() => {
    setEditRecord({ open: false });
  }, [setEditRecord]);

  const fetchTasksCallback = useCallback(async () => {
    await fetchTasks(filters);
  }, [fetchTasks, filters]);

  return (
    <div className={style.mainClassWrapper} style={{ height: !noHeader ? '100vh' : '85vh' }}>
      <MainWrapper title={'Test Runs'} stylesBack={noHeader ? { marginTop: '10px' } : {}} noHeader={noHeader}>
        <div className={style.mainClass}>
          <div className={style.exportDiv}>
            <div>
              <Button
                startCompo={filtersCount > 0 ? <Icon name={'FilterIconOrange'} /> : <Icon name={'FilterIcon'} />}
                text={`Filters ${filtersCount ? `(${filtersCount})` : ''}`}
                btnClass={filtersCount > 0 ? style.filterBtnActive : style.filterBtn}
                handleClick={toggleResize}
              />
              <TextField
                searchField
                searchIcon={true}
                clearIcon={clearIcon}
                startIconClass={style.startIcon}
                placeholder="Type and search..."
                onChange={handleSearchChange}
                onClear={handleClear}
              />
            </div>
            <Button
              text="Export"
              startCompo={<Icon name={'ExportIcon'} />}
              btnClass={style.btn}
              handleClick={handleExportError}
            />
          </div>
          <div className={style.optionsDivMobile}>
            {filtersCount > 0 && (
              <div>
                <span onClick={handleResetFilters2}>Reset Filters</span>
              </div>
            )}
            <div onClick={handleOpen} className={style.relativeClass}>
              <Icon name={'MenuIcon'} />
              {filtersCount > 0 && <div className={style.filterCountDot}>{filtersCount}</div>}
            </div>
            <div onClick={handleOpen2}>
              <Icon name={'MoreInvertIcon'} />
            </div>
          </div>
        </div>

        <div className={style.headerDivMobile}>
          <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} extraPadding>
            <FilterHeader
              {...{
                control,
                register,
                watch,
                setValue,
              }}
              reset={handleResetFilters2}
              onFilterApply={onFilterApply}
            />
          </MobileMenu>
        </div>
        <div className={style.flex}>
          <MobileMenu isOpen={isOpen2} setIsOpen={setIsOpen2}>
            <div className={style.secondMenuMobile}>
              <div className={style.change}>
                <Icon name={'ExportIcon'} />
                <p onClick={handleExportError}>Export</p>
              </div>
            </div>
          </MobileMenu>
        </div>
        {_isLoading && !tasks?.tasks?.length ? (
          <Loader />
        ) : (
          <>
            <h6 className={style.h6}> Tasks ({tasks?.tasksCount})</h6>
            <div className={`${style.tableWidth} ${style.relativeClass}`}>
              <GenericTable
                ref={containerRef}
                columns={columnsData({
                  setOpenDelModal,
                  isHoveringName,
                  setIsHoveringName,
                  searchedText: filters?.search,
                  setEditRecord,
                })}
                dataSource={tasks?.tasks || []}
                height={'calc(100vh - 265px)'}
                selectable={true}
                classes={{
                  test: style.test,
                  table: style.table,
                  thead: style.thead,
                  th: style.th,
                  containerClass: style.checkboxContainer,
                  tableBody: style.tableRow,
                }}
                filters={sortFilters}
                onClickHeader={handleSortFilters}
              />
              {_isLoading && <Loader tableMode />}
            </div>
          </>
        )}
      </MainWrapper>

      {/*NOTE: SIDE MODAL */}

      {allowResize && (
        <FiltersDrawer
          noHeader={noHeader}
          setDrawerOpen={setAllowResize}
          {...{
            control,
            register,
            watch,
            setValue,
            reset: handleResetFilters2,
          }}
          onFilterApply={onFilterApply}
          isDirty={filtersCount > 0}
        />
      )}

      {/*NOTE: BASIC MODAL */}

      {openDelModal.open && (
        <DeleteModal
          title={'Are You Sure You want to Delete This Task'}
          subtitle={
            openDelModal?.forceDelete
              ? 'This Task will be deleted from Crosscheck as Your Integration not found'
              : 'Task will be Deleted Permanently'
          }
          btnText="Yes, Delete This Task"
          openDelModal={openDelModal.open}
          setOpenDelModal={handleCloseDeleteModal}
          clickHandler={onDeleteHandler}
          isLoading={_isDeleteLoading}
        />
      )}
      {editRecord.open && (
        <CreateTaskEditModal
          editRecordId={editRecord.id}
          openDelModal={!!editRecord.open}
          projectId={projectId}
          setOpenDelModal={handleCloseEditRecord}
          onRefetch={fetchTasksCallback}
        />
      )}
    </div>
  );
};

const filterNames = ['applicationType', 'createdBy', 'createdAt', 'crossCheckAssignee', 'taskType'];

export default Tasks;
