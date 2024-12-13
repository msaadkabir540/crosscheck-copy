import { useEffect, useCallback, useState, useRef, useMemo } from 'react';

import { entries as _entries, debounce as _debounce } from 'lodash';
import { useForm } from 'react-hook-form';
import { isToday, isYesterday } from 'date-fns';
import { useSearchParams } from 'react-router-dom';

import MobileMenu from 'components/mobile-menu';
import MainWrapper from 'components/layout/main-wrapper';
import Button from 'components/button';
import Loader from 'components/loader';

import { useGetActivities } from 'api/v1/settings/activities';

import { formattedDate } from 'utils/date-handler';

import noData from 'assets/no-found.svg';

import ActivityCard from './activity-card';
import FiltersDrawer from './filters-drawer';
import FilterHeader from './header';
import { initialFilters } from './helper';
import style from './activity.module.scss';
import Icon from '../../components/icon/themed-icon';

const Activities = ({ noHeader, projectId, testCaseId }) => {
  const { control, register, watch, setValue, handleSubmit, reset } = useForm(initialFilters);
  const containerRef = useRef(null);
  const [filters, setFilters] = useState({ ...initialFilters, page: 1 });
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState({});
  const [allowResize, setAllowResize] = useState(false);
  const [filtersCount, setFiltersCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [filtersParams, setFiltersParams] = useSearchParams();
  const filterNames = ['activityBy', 'activityType', 'activityAt'];

  const paramFilters = useMemo(() => {
    const result = {};

    for (const paramName of filterNames) {
      if (['activityAt']?.includes(paramName)) {
        result[paramName] = {
          start: filtersParams?.get(`${paramName}.start`) || null,
          end: filtersParams?.get(`${paramName}.end`) || null,
        };
      } else {
        result[paramName] = filtersParams?.getAll(paramName) || [];
      }
    }

    if (!result?.activityAt?.start && !result?.activityAt?.end) {
      delete result.activityAt;
    }

    return {
      ...result,
      activityAt: result?.activityAt,
      page: filters?.page,
      perPage: 25,
    };
  }, [filtersParams, filterNames]);

  const { mutateAsync: _getActivities, isLoading } = useGetActivities();

  useEffect(() => {
    if (projectId) {
      onFilterReset();
    }
  }, [projectId]);

  const countAppliedFilters = () => {
    let count = 0;

    if (watch('activityBy')?.length > 0) {
      count++;
    }

    if (watch('activityType')?.length > 0) {
      count++;
    }

    if (watch('activityAt')?.start !== null && watch('activityAt')?.start !== undefined) {
      count++;
    }

    return setFiltersCount(count);
  };

  const getActivities = async (filters) => {
    const res = await _getActivities({
      ...filters,
      ...(projectId && { projectId }),
      ...(testCaseId && { testCaseId }),

      perPage: 25,
    });
    const preActivities = filters.page === 1 ? [] : [...activities];
    const newActivity = [...preActivities, ...(res?.activities || [])];

    const updatedFilteredActivities = _entries(
      newActivity?.reduce((acc, x) => {
        const key = isToday(new Date(x.activityAt))
          ? 'Today'
          : isYesterday(new Date(x.activityAt))
            ? 'Yesterday'
            : formattedDate(x.activityAt, 'dd MMM, yyyy');

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(x);

        return acc;
      }, {}),
    );

    setActivities(newActivity);

    setFilteredActivities(() => ({
      activitiesCount: res?.activitiesCount,
      activities: updatedFilteredActivities,
    }));
  };

  useEffect(() => {
    getActivities(
      projectId
        ? paramFilters
          ? { ...paramFilters, page: 0 }
          : { ...filters, page: 0 }
        : paramFilters
          ? paramFilters
          : filters,
    );
  }, [filters, projectId, testCaseId]);

  const onFilterSubmit = _debounce((data) => {
    setActivities([]);
    setFilteredActivities({});

    setFilters((pre) => ({
      ...pre,
      ...(data?.activityAt?.start &&
        data?.activityAt?.end && {
          activityAt: {
            start: formattedDate(data?.activityAt?.start, 'yyyy-MM-dd'),
            end: formattedDate(data?.activityAt?.end, 'yyyy-MM-dd'),
          },
        }),
      activityBy: data?.activityBy || [],
      activityType: data?.activityType || [],
      page: 1,
    }));

    const filterObject = filterNames?.reduce(
      (acc, filterName) => {
        const filterValue = watch(filterName);

        if (filterValue !== undefined && filterValue !== null) {
          if (filterName === 'activityAt') {
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
      { active: 7 },
    );

    setFiltersParams(filterObject);
    countAppliedFilters();
    setAllowResize(false);
  });

  const onFilterReset = () => {
    getActivities(projectId ? { ...filters, page: 0 } : filters);
    setActivities([]);
    setFilteredActivities({});
    reset();
    setValue('activityBy', []);
    setValue('activityType', []);
    setFiltersCount(0);
    setFilters(() => ({ ...initialFilters }));
    setFiltersParams({});
  };

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = containerRef.current;

    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (filteredActivities?.activitiesCount !== activities?.length && !isLoading) {
        containerRef?.current?.removeEventListener('scroll', handleScroll);

        setFilters((prev) => ({ ...prev, page: prev?.page + 1 }));
        // NOTE: Scroll up by 10 pixels from the last scroll position
        containerRef.current.scrollTo(scrollLeft, scrollTop - 10);
      }
    }
  }, [activities, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      containerRef?.current?.addEventListener('scroll', handleScroll);
    } else if (isLoading) {
      containerRef?.current?.removeEventListener('scroll', handleScroll);
    }

    return () => {
      containerRef?.current?.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, activities, isLoading]);

  const hanndleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <>
      <div
        style={{
          height: testCaseId ? '50vh' : '100vh',
          overflow: 'hidden',
        }}
      >
        <MainWrapper title="Activities" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')} noHeader={noHeader}>
          <div className={style.headerDiv}>
            <Button
              startCompo={filtersCount > 0 ? <Icon name={'FilterIconOrange'} /> : <Icon name={'FilterIcon'} />}
              text={`Filters ${filtersCount ? `(${filtersCount})` : ''}`}
              btnClass={filtersCount > 0 ? style.filterBtnActive : style.filterBtn}
              handleClick={() => {
                setAllowResize(!allowResize);
              }}
            />
          </div>
          <div className={style.headerDivMobile}>
            <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
              <FilterHeader
                onSubmit={onFilterSubmit}
                onReset={onFilterReset}
                {...{
                  control,
                  register,
                  watch,
                  setValue,
                  handleSubmit,
                  reset,
                }}
              />
            </MobileMenu>
          </div>
          <div className={style.menuIcon} onClick={hanndleOpen}>
            <Icon name={'MenuIcon'} />
          </div>
          {isLoading && (!activities.length || !filteredActivities?.activitiesCount) ? (
            <Loader />
          ) : (
            <div ref={containerRef} className={style.activityWrapper} style={{ height: '80vh', overflow: 'auto' }}>
              {filteredActivities?.activitiesCount ? (
                filteredActivities?.activities?.map((x) => (
                  <div key={x[0]}>
                    {!testCaseId && (
                      <p
                        className={style.dayText}
                        style={{
                          position: 'sticky',
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        {x[0]}
                      </p>
                    )}
                    <div className={style.activitiesSection}>
                      {x[1]?.map((ele) => (
                        <ActivityCard
                          key={ele.title}
                          title={ele.title}
                          activityType={ele.activityType}
                          description={ele.description}
                          activityBy={ele.activityBy}
                          createdAt={ele.createdAt}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - 265px)',
                  }}
                >
                  <img src={noData} alt="noData-icon" />
                </div>
              )}
            </div>
          )}
        </MainWrapper>
      </div>
      {allowResize && (
        <FiltersDrawer
          noHeader={noHeader}
          setDrawerOpen={setAllowResize}
          onFilterApply={onFilterSubmit}
          reset={onFilterReset}
          {...{
            control,
            register,
            watch,
            setValue,
            handleSubmit,
          }}
        />
      )}
    </>
  );
};

export default Activities;
