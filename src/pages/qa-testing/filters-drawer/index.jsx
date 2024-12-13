import { useCallback, useEffect, useMemo } from 'react';

import _ from 'lodash';

import SelectBox from 'components/select-box';
import Button from 'components/button';
import DateRange from 'components/date-range';

import style from './filter-drawer.module.scss';
import Icon from '../../../components/icon/themed-icon';
import SideModal from '../../../components/side-modal';

const FiltersDrawer = ({
  projectSpecific = '',
  setDrawerOpen,
  control,
  watch,
  setViewBug,
  tagsOptions,
  noHeader,
  searchParams,
  isDirty,
  setValue,
  data,
  reset,
  onFilterApply,
}) => {
  const {
    projectOptions = [],
    mileStonesOptions = [],
    featuresOptions = [],
    statusOptions = [],
    severityOptions = [],
    bugTypeOptions = [],
    testedDevicesOptions = [],
    testedEnvironmentOptions = [],
    testTypeOptions = [],
    reportedByOptions = [],
    bugByOptions = [],
    assignedToOptions = [],
  } = data;

  const environmentOptions = useMemo(() => {
    return testedEnvironmentOptions?.filter((env) => env?.projectId === projectSpecific);
  }, [testedEnvironmentOptions, projectSpecific]);

  const milestonesWatch = watch('milestones');
  const projectsWatch = watch('projects');

  useEffect(() => {
    projectSpecific && setValue('projects', [projectSpecific]);
  }, [projectSpecific, setValue]);

  useEffect(() => {
    if (!milestonesWatch || _.isEmpty(milestonesWatch)) {
      setValue('features', []);
    }
  }, [milestonesWatch, setValue]);

  useEffect(() => {
    if (!projectsWatch || _.isEmpty(projectsWatch)) {
      setValue('features', []);
      setValue('milestones', []);
    }
  }, [projectsWatch, setValue]);

  const onChange = useCallback(
    (name, dates) => {
      const [start, end] = dates;
      setValue(name, { start, end });
    },
    [setValue],
  );

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setViewBug(searchParams ? true : false);
  }, [searchParams, setDrawerOpen, setViewBug]);

  const handleReportedAtChange = useCallback((e) => onChange('reportedAt', e), [onChange]);

  const handleReTestDateChange = useCallback((e) => onChange('reTestDate', e), [onChange]);

  const handleFilterApply = useCallback(
    (e) => {
      e.preventDefault();
      onFilterApply();
    },
    [onFilterApply],
  );

  const handleResetFilters = useCallback(
    (e) => {
      e.preventDefault();
      reset();
      setDrawerOpen(false);
    },
    [reset, setDrawerOpen],
  );

  const handleChange = useCallback(
    (e) => {
      onChange('closedDate', e);
    },
    [onChange],
  );

  return (
    <>
      <SideModal filterMode open={true} handleClose={setDrawerOpen} className={style.main}>
        <div className={style.main}>
          <div className={style.header}>
            <span className={style.headerText}>Filters</span>
            <div id="filtersDrawer" alt="" onClick={handleCloseDrawer} className={style.hover1}>
              <Icon name={'CrossIcon'} />
              <div className={style.tooltip}>
                <p>Close</p>
              </div>
            </div>
          </div>
          <form className={style.body} style={{ height: noHeader ? '78vh' : '90vh' }}>
            <div className={style.bottom}>
              <div className={noHeader ? style.gridOne : style.gridTwo}>
                {!noHeader && (
                  <div>
                    <SelectBox
                      options={projectOptions}
                      label={'Project'}
                      name={'projects'}
                      control={control}
                      numberBadgeColor={'#39695b'}
                      dynamicClass={style.zDynamicState1}
                      showNumber
                      isMulti
                      placeholder="Select"
                    />
                  </div>
                )}
                <div>
                  <SelectBox
                    name="milestones"
                    placeholder="Select"
                    control={control}
                    badge
                    options={
                      projectSpecific
                        ? mileStonesOptions.filter((x) => x.projectId === projectSpecific)
                        : mileStonesOptions.filter((x) => watch('projects')?.includes(x.projectId))
                    }
                    label={' Milestone'}
                    isMulti
                    numberBadgeColor={'#39695b'}
                    dynamicClass={style.zDynamicState2}
                    showNumber
                    currentValue={watch('status' || [])}
                  />
                </div>
              </div>
              <div className={style.gridTwo}>
                <div>
                  <SelectBox
                    options={
                      projectSpecific
                        ? featuresOptions.filter((x) => watch('milestones')?.includes(x.milestoneId))
                        : featuresOptions.filter((x) => watch('milestones')?.includes(x.milestoneId))
                    }
                    label={'Feature'}
                    name={'features'}
                    control={control}
                    placeholder="Select"
                    numberBadgeColor={'#39695b'}
                    dynamicClass={style.zDynamicState3}
                    showNumber
                    isMulti
                  />
                </div>
                <div>
                  <SelectBox
                    options={statusOptions}
                    label={'Status'}
                    name={'status'}
                    placeholder="Select"
                    control={control}
                    numberBadgeColor={'#39695b'}
                    dynamicClass={style.zDynamicState4}
                    showNumber
                    isMulti
                  />
                </div>
              </div>
              <div className={style.gridTwo}>
                <div>
                  <SelectBox
                    options={bugTypeOptions}
                    label={'Bug Type'}
                    name={'bugType'}
                    placeholder="Select"
                    control={control}
                    numberBadgeColor={'#39695b'}
                    dynamicClass={style.zDynamicState5}
                    showNumber
                    isMulti
                  />{' '}
                </div>
                <div>
                  <SelectBox
                    options={severityOptions}
                    label={'Severity'}
                    placeholder="Select"
                    name={'severity'}
                    control={control}
                    numberBadgeColor={'#39695b'}
                    showNumber
                    isMulti
                  />
                </div>
              </div>
              <div className={style.gridTwo}>
                <div className={style.dateDiv}>
                  <DateRange
                    handleChange={handleReportedAtChange}
                    startDate={watch('reportedAt')?.start}
                    endDate={watch('reportedAt')?.end}
                    label="Reported Date"
                    placeholder="Select"
                    name="reportedAt"
                    popperPlacement={'auto'}
                    control={control}
                  />
                </div>

                <div className={style.dateDiv}>
                  {' '}
                  <SelectBox
                    options={reportedByOptions}
                    label={'Reported By'}
                    placeholder="Select"
                    name={'reportedBy'}
                    control={control}
                    numberBadgeColor={'#39695b'}
                    showNumber
                    isMulti
                  />
                </div>
              </div>
              <div className={style.gridTwo}>
                <div>
                  <SelectBox
                    options={bugByOptions}
                    label={'Developer'}
                    name={'bugBy'}
                    placeholder="Select"
                    control={control}
                    numberBadgeColor={'#39695b'}
                    showNumber
                    isMulti
                  />
                </div>
                <div>
                  <SelectBox
                    options={assignedToOptions}
                    label={'Assigned To'}
                    name={'assignedTo'}
                    placeholder="Select"
                    control={control}
                    numberBadgeColor={'#39695b'}
                    showNumber
                    isMulti
                  />
                </div>
              </div>
              <div className={style.gridTwo}>
                <div>
                  <SelectBox
                    options={testTypeOptions}
                    label={'Testing Type'}
                    placeholder="Select"
                    name={'testingType'}
                    control={control}
                    numberBadgeColor={'#39695b'}
                    showNumber
                    isMulti
                  />
                </div>
                <div className={style.dateDiv}>
                  <DateRange
                    handleChange={handleReTestDateChange}
                    startDate={watch('reTestDate')?.start}
                    endDate={watch('reTestDate')?.end}
                    label="Retest Date"
                    placeholder="Select"
                    name="reTestDate"
                    control={control}
                  />
                </div>
              </div>
              <div className={style.gridTwo}>
                <div>
                  <SelectBox
                    options={testedDevicesOptions}
                    label={'Testing Devices'}
                    placeholder="Select"
                    name={'testedDevice'}
                    control={control}
                    numberBadgeColor={'#39695b'}
                    showNumber
                    isMulti
                  />
                </div>
                <div>
                  <SelectBox
                    options={environmentOptions}
                    label={'Testing Environment'}
                    placeholder="Select"
                    name={'testedEnvironment'}
                    control={control}
                    numberBadgeColor={'#39695b'}
                    showNumber
                    isMulti
                  />
                </div>
              </div>
              <div className={style.gridTwo}>
                <div className={style.dateDiv}>
                  <DateRange
                    handleChange={handleChange}
                    startDate={watch('closedDate')?.start}
                    endDate={watch('closedDate')?.end}
                    label="Closed Date"
                    popperPlacement={'auto'}
                    placeholder="Select"
                    name="closedDate"
                    control={control}
                  />
                </div>
                <div>
                  <SelectBox
                    options={tagsOptions}
                    label={'Tags'}
                    name={'tags'}
                    control={control}
                    placeholder="Select"
                    numberBadgeColor={'#39695b'}
                    dynamicClass={style.zDynamicState3}
                    showNumber
                    isMulti
                  />
                </div>
              </div>

              <div className={style.resetDiv}>
                <Button
                  text={'Reset'}
                  type="button"
                  disabled={!isDirty}
                  btnClass={style.reset}
                  onClick={handleResetFilters}
                />
                <Button text={'Apply'} type="button" btnClass={style.applyClass} onClick={handleFilterApply} />
              </div>
            </div>
          </form>
        </div>
      </SideModal>
    </>
  );
};

export default FiltersDrawer;
