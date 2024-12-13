import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// NOTE: component
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { debounce as _debounce } from 'lodash';

import Button from 'components/button';
import FilterChip from 'components/filter-chip';

import { useToaster } from 'hooks/use-toaster';

import {
  useBugReporter,
  useDevelopersBug,
  useGetAnalytics,
  useGetBugsAging,
  useGetBugsSeverity,
  useGetBugsStatus,
  useGetBugsTypes,
} from 'api/v1/projects/dashboard';

import { exportAsPDF, exportAsPNG } from 'utils/file-handler';

import TestCaseSummary from './cards/test-case-summary';
import BugsReported from './cards/bugs-reported';
// NOTE: utils
import { initialFilter } from './helper';
// NOTE: css
import styles from './dashboard.module.scss';
import BugsStatus from './cards/bugs-status';
import BugsType from './cards/bugs-type';
import BugsSeverity from './cards/bugs-severity';
import AnalyticsCards from './cards/analytics-cards';
import BugsAging from './cards/bugs-aging';
import BugsReporter from './cards/bugs-reporter';
import { useDashboardFiltersOptions } from './filter-options';

const Index = () => {
  const { id } = useParams();
  const componentRef = useRef();
  const { toastError } = useToaster();
  const { watch, control, setValue } = useForm();
  const { data = {} } = useDashboardFiltersOptions();

  const [filters, setFilters] = useState({ ...initialFilter });
  const [typesFilters, setTypesFilters] = useState({ ...initialFilter });
  const [severityFilters, setSeverityFilters] = useState({ ...initialFilter });

  const [bugsReporterFilters, setBugsReporterFilters] = useState({ ...initialFilter });
  const [developersBugFilters, setDevelopersBugFilters] = useState({ ...initialFilter });
  const [bugsStatus, setBugsStatus] = useState({});
  const [bugsTypes, setBugsTypes] = useState({});
  const [bugsSeverity, setBugsSeverity] = useState({});
  const [bugsReporter, setBugsReporter] = useState({});
  const [developersBug, setDevelopersBug] = useState({});

  const { versionsOptions, environmentOptions } = useMemo(() => {
    return {
      versionsOptions: data?.testedVersionOptions?.filter((v) => v?.projectId == id),
      environmentOptions: data?.testedEnvironmentOptions?.filter((e) => e?.projectId == id),
    };
  }, [data, id]);

  const downloadHandler = useCallback((type) => {
    if (type === 'PNG') {
      exportAsPNG(componentRef);
    }

    if (type === 'PDF') {
      exportAsPDF(componentRef);
    }
  }, []);

  // NOTE: Get Bugs Status
  const { mutateAsync: _getBugsStatus, isLoading: _loadingGetBugsStatus } = useGetBugsStatus();

  const fetchBugsStatus = useCallback(
    async ({ id, filters }) => {
      try {
        const response = await _getBugsStatus({ id, filters });
        setBugsStatus(response);
      } catch (error) {
        toastError(error);
      }
    },
    [_getBugsStatus, toastError],
  );

  // NOTE: Get Bugs Types

  const { mutateAsync: _getBugsTypes, isLoading: _loadingGetBugsTypes } = useGetBugsTypes();

  const fetchBugsTypes = useCallback(
    async ({ id, filters }) => {
      try {
        const response = await _getBugsTypes({ id, filters });
        setBugsTypes(response);
      } catch (error) {
        toastError(error);
      }
    },
    [_getBugsTypes, toastError],
  );

  // NOTE: Get Bugs  severity
  const { mutateAsync: _getBugsSeverity, isLoading: _loadingGetBugsSeverity } = useGetBugsSeverity();

  const fetchBugsSeverity = useCallback(
    async ({ id, filters }) => {
      try {
        const response = await _getBugsSeverity({ id, filters });
        setBugsSeverity(response);
      } catch (error) {
        toastError(error);
      }
    },
    [_getBugsSeverity, toastError],
  );

  // NOTE: Get Bugs Aging

  const { data: bugsAging, refetch: refetchBugsAging } = useGetBugsAging({
    id,
    filters: {
      ...(filters?.testedVersion && { testedVersion: filters?.testedVersion }),
      ...(filters?.testedEnvironment && { testedEnvironment: filters?.testedEnvironment }),
    },
  });

  // NOTE: getBugs Reporter
  const { mutateAsync: _getBugsReporterHandler, isLoading: _loadingBugReporter } = useBugReporter();

  const fetchBugsReporter = useCallback(
    async ({ id, filters }) => {
      try {
        const response = await _getBugsReporterHandler({ id, filters });
        setBugsReporter(response);
      } catch (error) {
        toastError(error);
      }
    },
    [_getBugsReporterHandler, toastError],
  );

  // NOTE: getBugs Reporter
  const { mutateAsync: _getDevelopersBugHandler, isLoading: _loadingDevelopersBug } = useDevelopersBug();

  const fetchDevelopersBug = useCallback(
    async ({ id, filters }) => {
      try {
        const response = await _getDevelopersBugHandler({ id, filters });
        setDevelopersBug(response);
      } catch (error) {
        toastError(error);
      }
    },
    [_getDevelopersBugHandler, toastError],
  );

  // NOTE: Get Overall Analytics
  const { data: analytics, refetch: refetchAnalytics } = useGetAnalytics({
    id,
    filters: {
      ...(filters?.testedVersion && { testedVersion: filters?.testedVersion }),
      ...(filters?.testedEnvironment && { testedEnvironment: filters?.testedEnvironment }),
    },
  });

  const onFilterApply = _debounce(() => {
    const mainfilters = {
      ...(watch('testedVersion') && { testedVersion: watch('testedVersion') || [] }),
      ...(watch('testedEnvironment') && { testedEnvironment: watch('testedEnvironment') || [] }),
    };
    setFilters((pre) => ({ ...pre, ...mainfilters }));
    setTypesFilters((pre) => ({ ...pre, ...mainfilters }));
    setSeverityFilters((pre) => ({ ...pre, ...mainfilters }));
    setBugsReporterFilters((pre) => ({ ...pre, ...mainfilters }));
    setDevelopersBugFilters((pre) => ({ ...pre, ...mainfilters }));
  }, 1000);

  const handleResetVersionChip = useCallback(() => {
    setValue('testedVersion', []);
    onFilterApply();
  }, [setValue, onFilterApply]);

  const handleResetEnvironmentChip = useCallback(() => {
    setValue('testedEnvironment', []);
    onFilterApply();
  }, [setValue, onFilterApply]);

  useEffect(() => {
    fetchBugsStatus({ id, filters });
  }, [fetchBugsStatus, filters, id]);

  useEffect(() => {
    fetchBugsTypes({
      id: id,
      filters: { ...typesFilters },
    });
  }, [typesFilters, id, fetchBugsTypes]);

  useEffect(() => {
    fetchBugsSeverity({
      id: id,
      filters: { ...severityFilters },
    });
  }, [severityFilters, id, fetchBugsSeverity]);

  useEffect(() => {
    refetchAnalytics();
    refetchBugsAging();
  }, [refetchBugsAging, refetchAnalytics, filters, id]);

  useEffect(() => {
    fetchBugsReporter({ id, filters: bugsReporterFilters });
  }, [bugsReporterFilters, fetchBugsReporter, id]);

  useEffect(() => {
    fetchDevelopersBug({ id, filters: developersBugFilters });
  }, [developersBugFilters, fetchDevelopersBug, id]);

  return (
    <>
      <div className={styles.btnWrapper}>
        <Button
          type={'button'}
          text={'Refresh'}
          handleClick={onFilterApply}
          btnClass={styles.btnClassUncheckModal}
          data-cy="refresh-project-dashboard-btn"
        />
        <div className={styles.chipsDiv}>
          <FilterChip
            isMulti
            openLeft
            watch={watch}
            label={'Version'}
            control={control}
            name={'testedVersion'}
            options={versionsOptions}
            applyFilter={onFilterApply}
            onReset={handleResetVersionChip}
            isDisabled={!watch('testedVersion')?.length}
            selectedCount={watch('testedVersion')?.length}
          />
          <FilterChip
            isMulti
            openLeft
            watch={watch}
            control={control}
            label={'Environment'}
            name={'testedEnvironment'}
            applyFilter={onFilterApply}
            options={environmentOptions}
            onReset={handleResetEnvironmentChip}
            isDisabled={!watch('testedEnvironment')?.length}
            selectedCount={watch('testedEnvironment')?.length}
          />
        </div>
      </div>
      <div className={styles.mainWrapper}>
        <div className={styles.flexWrapperLeft}>
          <div className={styles.upper}>
            <AnalyticsCards analyticsData={analytics?.data} />
            <div className={styles.mainWrapper2}>
              <BugsAging data={bugsAging?.bugsAgingData} />
              <BugsSeverity
                isLoading={_loadingGetBugsSeverity}
                projectId={id}
                data={bugsSeverity?.severityData}
                setBugsSeverity={setBugsSeverity}
                initialFilter={initialFilter}
                setSeverityFilters={setSeverityFilters}
              />
            </div>
          </div>
          <div className={styles.testSummary}>
            <TestCaseSummary {...{ filters }} />
          </div>
        </div>
        <div className={styles.flexWrapperRight}>
          <BugsStatus
            isLoading={_loadingGetBugsStatus}
            projectId={id}
            statusData={bugsStatus?.count}
            statusDataPercentage={bugsStatus?.percentage}
            initialFilter={initialFilter}
            setFilters={setFilters}
          />

          <BugsReported {...{ componentRef, filters, downloadHandler }} />
        </div>
      </div>
      <div className={styles.bottomWrapper}>
        <BugsReporter
          isLoading={_loadingBugReporter}
          projectId={id}
          bugsReporter={bugsReporter?.bugsReporterData}
          initialFilter={initialFilter}
          setBugsReporterFilters={setBugsReporterFilters}
          setBugsReporter={setBugsReporter}
        />
        <BugsType
          isLoading={_loadingGetBugsTypes}
          projectId={id}
          data={bugsTypes?.bugTypeData}
          setBugsTypes={setBugsTypes}
          initialFilter={initialFilter}
          setTypesFilters={setTypesFilters}
        />
        <BugsReporter
          isLoading={_loadingDevelopersBug}
          projectId={id}
          name={`Developer's Bugs`}
          bugsReporter={developersBug?.developersData}
          initialFilter={initialFilter}
          setBugsReporterFilters={setDevelopersBugFilters}
          setBugsReporter={setDevelopersBug}
        />
      </div>
    </>
  );
};

export default Index;
