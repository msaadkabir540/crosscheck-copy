import { useState, useEffect, useCallback } from 'react';

import { useForm } from 'react-hook-form';
import { debounce as _debounce } from 'lodash';

import FilterChip from 'components/filter-chip';
import DateRange from 'components/date-range';

import { useToaster } from 'hooks/use-toaster';

import { useGetAllCaptures } from 'api/v1/captures/capture.js';

import { initialFilters, dateOptions, typeOptions, sortOptions, formatDate } from '../helper';
import style from './style.module.scss';
import SortFilter from '../sort-by';

const CaptureFilters = ({ setChecks, loading, setIsCheckLoading, viewBy }) => {
  const { control, watch, reset } = useForm();

  const [filters, setFilters] = useState({
    page: 1,
    perPage: 25,
    type: [],
    sortOn: 'createdAt',
    sortBy: 'desc',
    viewBy,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { toastError } = useToaster();
  const { mutateAsync: _getChecksHandler, isLoading: _isCheckLoading } = useGetAllCaptures();

  const _getChecks = useCallback(async () => {
    try {
      const newChecks = await _getChecksHandler(filters);

      if (filters.page === 1) {
        setChecks(newChecks);
      } else {
        setChecks((prevChecks) => ({
          ...prevChecks,
          checks: [...(prevChecks?.checks || []), ...(newChecks?.checks || [])],
          count: newChecks.count,
        }));
      }
    } catch (error) {
      toastError(error);
      console.error(error);
    }
  }, [_getChecksHandler, filters, setChecks, toastError]);

  useEffect(() => {
    setIsCheckLoading(_isCheckLoading);
  }, [_isCheckLoading, setIsCheckLoading]);

  const handleFilteredDateChange = _debounce((values) => {
    if (values.label === 'Custom Range') {
      setShowDatePicker(true);
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        page: 1,
        filterDate: {
          start: values?.value?.startDate,
          end: values?.value?.endDate,
        },
      }));
    }
  }, 1000);

  const resetFilters = useCallback(
    (filterName) => {
      reset({
        ...initialFilters,
        [filterName]: initialFilters[filterName],
      });
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterName]: initialFilters[filterName],
      }));
    },
    [reset],
  );

  const onFilterApply = _debounce(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: 1,
      ...(watch('Type') && { type: watch('Type') }),
    }));
  }, 1000);

  const onResetDate = useCallback(() => resetFilters('filterDate'), [resetFilters]);

  const onResetType = useCallback(() => resetFilters('type'), [resetFilters]);

  useEffect(() => {
    _getChecks();
  }, [filters, _getChecks]);

  useEffect(() => {
    if (loading) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        page: prevFilters.page + 1,
      }));
    }
  }, [loading]);

  const handleSortInfoChange = _debounce(({ sortOn, sortBy }) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: 1,
      sortBy: sortBy,
      sortOn: sortOn,
    }));
  }, 1000);

  const handleChange = useCallback((dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  }, []);

  useEffect(() => {
    if (startDate !== null && endDate !== null) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        filterDate: {
          start: formatDate(startDate),
          end: formatDate(endDate),
        },
      }));
    } else {
      setFilters((prevFilters) => {
        const { ...rest } = prevFilters;

        return rest;
      });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && !event.target.closest(`.${style.container_custom_range}`)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  useEffect(() => {
    reset(initialFilters);
    setStartDate(null);
    setEndDate(null);
    setFilters(() => ({
      ...initialFilters,
      viewBy,
    }));
  }, [viewBy, reset]);

  return (
    <div className={style.main_container}>
      <div className={style.container_custom_range_parent}>
        <FilterChip
          name={'filterDate'}
          label={'Date Created'}
          control={control}
          searchable={false}
          watch={watch}
          onReset={onResetDate}
          isSingleOption={true}
          applyFilter={handleFilteredDateChange}
          options={dateOptions}
        />
        <div className={style.container_custom_range}>
          {showDatePicker && (
            <DateRange
              startDate={startDate}
              endDate={endDate}
              handleChange={handleChange}
              placeholder="Select"
              name="filterDate"
              control={control}
              openBydefault={showDatePicker}
            />
          )}
        </div>
      </div>
      <FilterChip
        name={'Type'}
        label={'Type'}
        control={control}
        searchable={false}
        watch={watch}
        onReset={onResetType}
        isSingleOption={true}
        applyFilter={onFilterApply}
        options={typeOptions}
      />
      <div className={style.filter_chip_sortby}>
        <span>Sort by:</span>
        <SortFilter
          applyFilter={handleSortInfoChange}
          options={sortOptions}
          name={'SortBY'}
          label={'SortBY'}
          control={control}
        />
      </div>
    </div>
  );
};

export default CaptureFilters;
