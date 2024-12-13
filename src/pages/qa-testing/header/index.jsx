import { useCallback, useEffect, useMemo, useState } from 'react';

import Button from 'components/button';
import SelectBox from 'components/select-box';

import style from './header.module.scss';
import ResetPopup from './reset-popup';
import Icon from '../../../components/icon/themed-icon';

const FilterHeader = ({
  mobileView,
  projectSpecific,
  paramFilters,
  control,
  watch,
  setValue,
  reset,
  onFilterApply,
  data,
}) => {
  const [openFilter, setOpenFilter] = useState(false);

  const {
    projectOptions = [],
    mileStonesOptions = [],
    featuresOptions = [],
    statusOptions = [],
    severityOptions = [],
    bugTypeOptions = [],
    testTypeOptions = [],
    reportedByOptions = [],
    bugByOptions = [],
    assignedToOptions = [],
    issueTypeOptions = [],
  } = data;

  const [selectedDates, setSelectedDates] = useState();

  useEffect(() => {
    if (paramFilters) {
      Object.keys(paramFilters)?.forEach((key) => {
        const value = paramFilters[key];

        if (key.endsWith('At') || (key.endsWith('Date') && value)) {
          if (value?.start) setValue(`${key}.start`, new Date(value?.start));
          if (value?.end) setValue(`${key}.end`, new Date(value?.end));
        } else {
          setValue(key, value);
        }
      });
    }
  }, [paramFilters, setValue]);

  const onChange = useCallback(
    (name, dates) => {
      const [start, end] = dates;
      setValue(name, { start, end });
    },
    [setValue],
  );

  const toggleFilter = useCallback(() => {
    setOpenFilter((prev) => !prev);
  }, [setOpenFilter]);

  const handleReset = useCallback(
    (e) => {
      e.preventDefault();
      setSelectedDates({});
      reset();
    },
    [reset, setSelectedDates],
  );

  const handleFilterApply = useCallback(
    (e) => {
      e.preventDefault();
      onFilterApply();
    },
    [onFilterApply],
  );

  const mileStonesOptionsMemoized = useMemo(() => {
    if (projectSpecific) {
      return mileStonesOptions?.filter((x) => x?.projectId === projectSpecific);
    } else {
      const projects = watch('projects');

      return mileStonesOptions?.filter((x) => projects?.includes(x?.projectId));
    }
  }, [projectSpecific, mileStonesOptions, watch]);

  const featuresOptionsMemoized = useMemo(() => {
    return featuresOptions?.filter((x) => featuresOptions?.includes(x.milestoneId));
  }, [featuresOptions]);

  return (
    <>
      <div className={style.mainHeader} style={{ paddingBottom: mobileView ? '35px' : '' }}>
        <div className={style.grid}>
          <div className={style.gridInner}>
            {!projectSpecific && (
              <div className={`${style.z1} ${style.statusBar}`}>
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
            <div className={`${style.z2} ${style.statusBar}`}>
              <SelectBox
                name="milestones"
                placeholder="Select"
                control={control}
                badge
                options={mileStonesOptionsMemoized}
                label={' Milestone'}
                isMulti
                numberBadgeColor={'#39695b'}
                dynamicClass={style.zDynamicState2}
                showNumber
                currentValue={watch('status' || [])}
              />
            </div>

            <div className={`${style.z3} ${style.statusBar}`}>
              <SelectBox
                options={featuresOptionsMemoized}
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
            <div className={`${style.z4} ${style.statusBar}`}>
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
            <div className={`${style.z5} ${style.statusBar}`}>
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
              />
            </div>
            <div className={`${style.z6} ${style.statusBar}`}>
              <SelectBox
                options={issueTypeOptions}
                label={'Issue Type'}
                name={'issueType'}
                placeholder="Select"
                control={control}
                numberBadgeColor={'#39695b'}
                dynamicClass={style.zDynamicState6}
                showNumber
                isMulti
              />
            </div>

            {openFilter && (
              <ResetPopup
                control={control}
                setValue={setValue}
                watch={watch}
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                onChange={onChange}
                options={{
                  severityOptions,
                  bugByOptions,
                  testTypeOptions,
                  reportedByOptions,
                  assignedToOptions,
                }}
              />
            )}
            <div className={style.allFilters}>
              <ResetPopup
                control={control}
                setValue={setValue}
                watch={watch}
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                onChange={onChange}
                options={{
                  severityOptions,
                  bugByOptions,
                  testTypeOptions,
                  reportedByOptions,
                  assignedToOptions,
                }}
              />
            </div>
          </div>
          <div className={style.resetDiv}>
            <div
              onClick={toggleFilter}
              style={{
                transform: openFilter ? 'rotate(180deg)' : '',
              }}
              className={style.openAllfilterBtn}
            >
              <Icon name={'MoreFilter'} />
            </div>

            <Button text={'Reset'} type="button" btnClass={style.reset} onClick={handleReset} />
            <Button text={'Apply'} type="button" btnClass={style.applyClass} onClick={handleFilterApply} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterHeader;
