import { useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import Button from 'components/button';
import SelectBox from 'components/select-box';
import DateRange from 'components/date-range';

import style from './header.module.scss';
import ResetPopup from './reset-popup';
import { useProjectOptions } from '../helper';

const FilterHeader = ({ control, watch, paramFilters, setValue, mobileView, reset, onFilterApply }) => {
  const [openFilter] = useState(false);

  const { data = {} } = useProjectOptions();

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

  const { statusOptions = [], createdByOptions = [], assignedTo = [] } = data;

  const onChange = useCallback(
    (name, dates) => {
      const [start, end] = dates;

      setValue(name, { start, end });
    },
    [setValue],
  );

  const handleDueDate = useCallback((e) => onChange('dueDate', e), [onChange]);
  const handleCreatedAt = useCallback((e) => onChange('createdAt', e), [onChange]);

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

  return (
    <>
      <div className={style.mainHeader} style={{ paddingBottom: mobileView ? '35px' : '' }}>
        <div className={style.grid}>
          <div className={style.gridInner}>
            <div className={`${style.z1} ${style.statusBar}`}>
              <SelectBox
                options={statusOptions}
                label={'Status'}
                name={'status'}
                control={control}
                numberBadgeColor={'#39695b'}
                placeholder={'Select'}
                dynamicClass={style.zDynamicState45}
                showNumber
                isMulti
              />
            </div>
            <div className={`${style.z2} ${style.statusBar}`}>
              <SelectBox
                options={assignedTo}
                label={'Assigned To'}
                placeholder={'Select'}
                name={'assignedTo'}
                control={control}
                numberBadgeColor={'#39695b'}
                dynamicClass={style.zDynamicState4}
                showNumber
                isMulti
              />
            </div>

            <div className={`${style.z3} ${style.statusBar}`}>
              <DateRange
                handleChange={handleDueDate}
                startDate={watch('dueDate')?.start}
                endDate={watch('dueDate')?.end}
                label={'Due Date'}
                name={'dueDate'}
                placeholder={'Select'}
                control={control}
              />
            </div>
            <div className={style.datePicker}>
              <DateRange
                handleChange={handleCreatedAt}
                startDate={watch('createdAt')?.start}
                endDate={watch('createdAt')?.end}
                label={'Created At'}
                name={'createdAt'}
                placeholder={'Select'}
                control={control}
              />
            </div>
            <div className={`${style.z4} ${style.datePicker}`}>
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
          </div>
          <div className={style.resetDiv}>
            <Button text={'Reset'} type="button" btnClass={style.reset} onClick={handleReset} />
            <Button text={'Apply'} type="button" btnClass={style.applyClass} onClick={handleSubmit} />
          </div>
        </div>
      </div>

      {openFilter && <ResetPopup control={control} />}
    </>
  );
};

FilterHeader.propTypes = {
  control: PropTypes.object.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  mobileView: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  onFilterApply: PropTypes.func.isRequired,
};
export default FilterHeader;
