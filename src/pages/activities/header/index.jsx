import { useCallback, useState } from 'react';

import { useAppContext } from 'context/app-context';

import Button from 'components/button';
import SelectBox from 'components/select-box';
import DateRange from 'components/date-range';
import Permissions from 'components/permissions';

import { useActivityOptions } from './helper';
import style from './header.module.scss';

const FilterHeader = ({ control, setValue, watch, handleSubmit, reset, onSubmit, onReset }) => {
  const { userDetails } = useAppContext();

  const { data = {} } = useActivityOptions();
  const { activityBy = [], activityType = [] } = data;

  const [, setSelectedDates] = useState();

  const onChange = (name, dates) => {
    const [start, end] = dates;

    setSelectedDates((pre) => ({ ...pre, [name]: { start, end } }));
    setValue(name, { start, end });
  };

  const handleReset = useCallback(
    (e) => {
      e.preventDefault();
      reset();
      onReset();
    },
    [reset, onReset],
  );

  return (
    <>
      <div className={style.mainHeader}>
        <div className={style.grid}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'flex-end',
            }}
          >
            <Permissions allowedRoles={['Admin']} currentRole={userDetails.role}>
              <div className={style.statusBar}>
                <SelectBox
                  options={activityBy}
                  name="activityBy"
                  control={control}
                  badge
                  isMulti
                  label={'Activity By'}
                  placeholder={'Select'}
                  numberBadgeColor={'#39695b'}
                  dynamicClass={style.zDynamicState5}
                  showNumber
                />
              </div>
            </Permissions>
            <div className={style.statusBar}>
              <DateRange
                handleChange={(e) => onChange('activityAt', e)}
                startDate={watch('activityAt')?.start}
                endDate={watch('activityAt')?.end}
                label={'Activity Date'}
                placeholder={'Select'}
                name={'activityAt'}
                control={control}
              />
            </div>
            <div className={style.statusBar}>
              <SelectBox
                label={'Type'}
                options={activityType}
                name={'activityType'}
                control={control}
                isMulti
                numberBadgeColor={'#39695b'}
                placeholder={'Select'}
                dynamicClass={style.zDynamicState5}
                showNumber
              />
            </div>
            <div className={style.resetDiv}>
              <Button
                text={'Reset'}
                type="button"
                btnClass={style.reset}
                style={{ marginRight: '10px', marginLeft: '10px' }}
                onClick={handleReset}
              />
              <Button text={'Apply'} type="submit" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FilterHeader;
