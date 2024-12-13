import { useCallback } from 'react';

import Button from 'components/button';
import SelectBox from 'components/select-box';
import DateRange from 'components/date-range';

import style from './header.module.scss';
import { useProjectOptions } from './helper';

const FilterHeader = ({ control, watch, setValue, reset, onFilterApply }) => {
  const { data = {} } = useProjectOptions();

  const { applicationOptions = [], createdByOptions = [], taskTypeOptions = [], assignedTo = [] } = data;

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

  const handleResetForm = useCallback(
    (e) => {
      e.preventDefault();
      reset();
    },
    [reset],
  );

  const handleFilterApply = useCallback(
    (e) => {
      e.preventDefault();
      onFilterApply();
    },
    [onFilterApply],
  );

  return (
    <>
      <div className={style.mainHeader}>
        <div className={style.grid}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div className={style.statusBar} style={{ zIndex: '100' }}>
              <SelectBox
                options={applicationOptions}
                label={'Application'}
                name={'applicationType'}
                control={control}
                numberBadgeColor={'#39695b'}
                placeholder={'Select'}
                dynamicClass={style.zDynamicState45}
                showNumber
                isMulti
              />
            </div>
            <div className={style.statusBar} style={{ zIndex: '99' }}>
              <SelectBox
                options={taskTypeOptions}
                label={'Tast Type'}
                placeholder={'Select'}
                name={'taskType'}
                control={control}
                numberBadgeColor={'#39695b'}
                dynamicClass={style.zDynamicState4}
                showNumber
                isMulti
              />
            </div>

            <div className={style.datePicker} style={{ zIndex: '98' }}>
              <SelectBox
                options={assignedTo}
                label={'Assignee'}
                placeholder={'Select'}
                name={'crossCheckAssignee'}
                control={control}
                numberBadgeColor={'#39695b'}
                dynamicClass={style.zDynamicState4}
                showNumber
                isMulti
              />
            </div>
            <div className={style.datePicker} style={{ zIndex: '97' }}>
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
            <div className={style.datePicker} style={{ zIndex: '96' }}>
              <DateRange
                handleChange={handleCreatedAtChange}
                startDate={watch('createdAt')?.start}
                endDate={watch('createdAt')?.end}
                label={'Created At'}
                name={'createdAt'}
                placeholder={'Select'}
                control={control}
              />
            </div>
          </div>
          <div className={style.resetDiv}>
            <Button
              text={'Reset'}
              type="button"
              btnClass={style.reset}
              style={{ marginRight: '10px', marginLeft: '10px' }}
              onClick={handleResetForm}
            />
            <Button text={'Apply'} type="button" onClick={handleFilterApply} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterHeader;
