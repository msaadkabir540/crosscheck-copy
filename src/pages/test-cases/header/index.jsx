import { useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import _ from 'lodash';

import Button from 'components/button';
import SelectBox from 'components/select-box';

import style from './header.module.scss';
import ResetPopup from './reset-popup';
import { useProjectOptions } from '../helper';
import Icon from '../../../components/icon/themed-icon';

const FilterHeader = ({ projectSpecific = '', control, paramFilters, watch, setValue, reset, onFilterApply }) => {
  const { data = {} } = useProjectOptions();

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

  const [openFilter, setOpenFilter] = useState(false);

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

  useEffect(() => {
    if (paramFilters) {
      Object.keys(paramFilters)?.forEach((key) => {
        const value = paramFilters[key];

        if (key.endsWith('At') && value) {
          if (value?.start) setValue(`${key}.start`, new Date(value?.start));
          if (value?.end) setValue(`${key}.end`, new Date(value?.end));
        } else {
          setValue(key, value);
        }
      });
    }
  }, [paramFilters, setValue]);

  const handleReset = useCallback(
    (e) => {
      e.preventDefault();
      reset();
    },
    [reset],
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onFilterApply();
    },
    [onFilterApply],
  );

  const handleOpen = useCallback(() => setOpenFilter((prev) => !prev), []);

  return (
    <>
      <div className={style.mainHeader}>
        <div className={style.grid}>
          <div className={style.gapNone}>
            {!projectSpecific && (
              <div className={`${style.z1} ${style.statusBar}`}>
                <SelectBox
                  name="projects"
                  control={control}
                  badge
                  options={projectOptions}
                  label={'Project'}
                  isMulti
                  placeholder={'Select'}
                  numberBadgeColor={'#39695b'}
                  dynamicClass={style.zDynamicState5}
                  showNumber
                />
              </div>
            )}

            <div className={`${style.z2} ${style.statusBar}`}>
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
                dynamicClass={style.zDynamicState5}
                showNumber
                isMulti
              />
            </div>

            <div className={`${style.z3} ${style.statusBar}`}>
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
                dynamicClass={style.zDynamicState4}
                showNumber
                isMulti
              />
            </div>
            <div className={`${style.z4} ${style.statusBar}`}>
              <SelectBox
                name="status"
                control={control}
                badge
                options={statusOptions}
                label={'Status'}
                isMulti
                placeholder={'Select'}
                numberBadgeColor={'#39695b'}
                dynamicClass={style.zDynamicState4}
                showNumber
                currentValue={watch('status' || [])}
              />
            </div>
            <div className={`${style.z5} ${style.statusBar}`}>
              <SelectBox
                options={createdByOptions}
                label={'Created By'}
                placeholder={'Select'}
                name={'createdBy'}
                control={control}
                numberBadgeColor={'#39695b'}
                dynamicClass={style.zDynamicState4}
                showNumber
                isMulti
              />
            </div>

            {openFilter && (
              <ResetPopup
                projectSpecific={projectSpecific}
                control={control}
                watch={watch}
                setValue={setValue}
                options={{
                  weighageOptions,
                  testTypeOptions,
                  lastTestedBy,
                }}
              />
            )}
            <div className={style.allFilters}>
              <ResetPopup
                projectSpecific={projectSpecific}
                control={control}
                watch={watch}
                setValue={setValue}
                options={{
                  weighageOptions,
                  testTypeOptions,
                  lastTestedBy,
                }}
              />
            </div>
          </div>
        </div>
        <div className={style.resetDiv}>
          <div
            style={{
              transform: openFilter ? 'rotate(180deg)' : '',
            }}
            onClick={handleOpen}
            className={style.openAllfilterBtn}
          >
            <Icon name={'MoreFilter'} />
          </div>

          <Button text={'Reset'} type="button" btnClass={style.reset} onClick={handleReset} />
          <Button text={'Apply'} type="button" btnClass={style.applyClass} onClick={handleSubmit} />
        </div>
      </div>
    </>
  );
};

FilterHeader.propTypes = {
  projectSpecific: PropTypes.string,
  control: PropTypes.any.isRequired,
  mobileView: PropTypes.bool.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  onFilterApply: PropTypes.func.isRequired,
};
export default FilterHeader;
