import { useCallback, useEffect } from 'react';

import PropTypes from 'prop-types';
import _ from 'lodash';

import SelectBox from 'components/select-box';
import Button from 'components/button';
import DateRange from 'components/date-range';

import { useProjectOptions } from '../helper';
import Icon from '../../../components/icon/themed-icon';
import SideModal from '../../../components/side-modal';
import style from './filter-drawer.module.scss';

const FiltersDrawer = ({
  projectSpecific = '',
  setDrawerOpen,
  control,
  watch,
  noHeader,
  isDirty,
  setValue,
  tagsOptions,
  reset,
  onFilterApply,
}) => {
  const { data = {} } = useProjectOptions();
  console.log(isDirty, 'isDirty');

  const {
    projectOptions = [],
    mileStonesOptions = [],
    featuresOptions = [],
    statusOptions = [],
    weighageOptions = [],
    testTypeOptions = [],
    createdByOptions = [],
    lastTestedBy = [],
  } = data;

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

  const handleCreatedAtChange = useCallback(
    (e) => {
      onChange('createdAt', e);
    },
    [onChange],
  );

  const handleLastTestedAtChange = useCallback(
    (e) => {
      onChange('lastTestedAt', e);
    },
    [onChange],
  );

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, [setDrawerOpen]);

  const handleReset = useCallback(
    (e) => {
      e.preventDefault();
      reset();
      setDrawerOpen(false);
    },
    [reset, setDrawerOpen],
  );

  const handleApply = useCallback(
    (e) => {
      e.preventDefault();
      onFilterApply();
    },
    [onFilterApply],
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
                      name="projects"
                      control={control}
                      badge
                      options={projectOptions}
                      label={'Project'}
                      isMulti
                      placeholder={'Select'}
                      numberBadgeColor={'#39695b'}
                      showNumber
                      id="testcase-filtermodal-project"
                    />
                  </div>
                )}
                <div>
                  <SelectBox
                    options={
                      projectSpecific
                        ? mileStonesOptions.filter((x) => x.projectId === projectSpecific)
                        : mileStonesOptions.filter((x) => watch('projects')?.includes(x.projectId))
                    }
                    label={'Milestone'}
                    name={'milestones'}
                    control={control}
                    numberBadgeColor={'#39695b'}
                    placeholder={'Select'}
                    showNumber
                    isMulti
                    id="testcase-filtermodal-miestone"
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
                    placeholder={'Select'}
                    control={control}
                    numberBadgeColor={'#39695b'}
                    showNumber
                    isMulti
                    id="testcase-filtermodal-feature"
                  />
                </div>
                <div>
                  <SelectBox
                    name="status"
                    control={control}
                    badge
                    options={statusOptions}
                    label={'Status'}
                    isMulti
                    placeholder={'Select'}
                    numberBadgeColor={'#39695b'}
                    showNumber
                    currentValue={watch('status' || [])}
                    id="testcase-filtermodal-status"
                  />
                </div>
              </div>
              <div className={style.gridTwo}>
                <div className={style.dateDiv}>
                  <DateRange
                    handleChange={handleCreatedAtChange}
                    startDate={watch('createdAt')?.start}
                    endDate={watch('createdAt')?.end}
                    label={'Created Date'}
                    placeholder={'Select'}
                    popperPlacement={'auto'}
                    name={'createdAt'}
                    control={control}
                    id="testcase-filtermodal-daterange"
                  />
                </div>
                <div className={style.dateDiv}>
                  <SelectBox
                    options={createdByOptions}
                    label={'Created By'}
                    placeholder={'Select'}
                    name={'createdBy'}
                    control={control}
                    numberBadgeColor={'#39695b'}
                    showNumber
                    isMulti
                    id="testcase-filtermodal-createdby"
                  />
                </div>
              </div>
              <div className={style.gridTwo}>
                <div className={style.dateDiv}>
                  <DateRange
                    handleChange={handleLastTestedAtChange}
                    startDate={watch('lastTestedAt')?.start}
                    endDate={watch('lastTestedAt')?.end}
                    label="Last Tested Date"
                    name="lastTestedAt"
                    popperPlacement={'auto'}
                    control={control}
                    placeholder={'Select'}
                    id="testcase-filtermodal-lasttesteddate"
                  />
                </div>
                <div className={style.dateDiv}>
                  <SelectBox
                    options={lastTestedBy}
                    label={'Last Tested By'}
                    name={'lastTestedBy'}
                    control={control}
                    placeholder="Select"
                    numberBadgeColor={'#39695b'}
                    showNumber
                    isMulti
                    id="testcase-filtermodal-lasttestedby"
                  />
                </div>
              </div>
              <div className={style.gridTwo}>
                <div>
                  <SelectBox
                    options={testTypeOptions}
                    label={'Test Type'}
                    name={'testType'}
                    control={control}
                    placeholder="Select"
                    numberBadgeColor={'#39695b'}
                    showNumber
                    isMulti
                    id="testcase-filtermodal-testtype"
                    isSearchable={false}
                  />
                </div>
                <div>
                  <SelectBox
                    options={[
                      { label: 'Active', value: 'Active', checkbox: true },
                      { label: 'Obsolete', value: 'Obsolete', checkbox: true },
                    ]}
                    label={'State'}
                    name={'state'}
                    control={control}
                    placeholder="Select"
                    numberBadgeColor={'#39695b'}
                    showNumber
                    isMulti
                    id="testcase-filtermodal-state"
                    isSearchable={false}
                  />
                </div>
              </div>
              <div className={style.gridTwo}>
                <div>
                  <SelectBox
                    options={tagsOptions}
                    label={'Tags'}
                    name={'tags'}
                    control={control}
                    placeholder="Select"
                    numberBadgeColor={'#39695b'}
                    showNumber
                    isMulti
                  />
                </div>
                <div>
                  <SelectBox
                    options={createdByOptions}
                    label={'Assigned To'}
                    name={'assignedTo'}
                    control={control}
                    placeholder="Select"
                    numberBadgeColor={'#39695b'}
                    showNumber
                    isMulti
                  />
                </div>
              </div>
              <div className={style.WeightageClass}>
                <div>
                  <SelectBox
                    options={weighageOptions}
                    label={'Weightage'}
                    name={'weightage'}
                    control={control}
                    placeholder="Select"
                    numberBadgeColor={'#39695b'}
                    showNumber
                    isMulti
                    id="testcase-filtermodal-weightage"
                  />
                </div>
              </div>

              <div className={style.resetDiv}>
                <Button
                  text={'Reset'}
                  type="button"
                  btnClass={style.reset}
                  disabled={!isDirty}
                  onClick={handleReset}
                  data-cy="testcase-filtermodal-reset-btn"
                />
                <Button
                  text={'Apply'}
                  type="button"
                  btnClass={style.applyClass}
                  onClick={handleApply}
                  data-cy="testcase-filtermodal-apply-btn"
                />
              </div>
            </div>
          </form>
        </div>
      </SideModal>
    </>
  );
};

FiltersDrawer.propTypes = {
  projectSpecific: PropTypes.string,
  setDrawerOpen: PropTypes.func.isRequired,
  control: PropTypes.any.isRequired,
  watch: PropTypes.func.isRequired,
  noHeader: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  onFilterApply: PropTypes.func.isRequired,
};

export default FiltersDrawer;
