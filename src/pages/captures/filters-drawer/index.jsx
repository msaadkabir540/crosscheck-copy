import { useCallback } from 'react';

import SelectBox from 'components/select-box';
import Button from 'components/button';
import DateRange from 'components/date-range';

import Icon from '../../../components/icon/themed-icon';
import style from './filterDrawer.module.scss';

const FiltersDrawer = ({ setDrawerOpen, control, watch, setValue, reset, onFilterApply }) => {
  const onChange = (name, dates) => {
    const [start, end] = dates;

    setValue(name, { start, end });
  };

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, [setDrawerOpen]);

  const handleReset = useCallback(
    (e) => {
      e.preventDefault();
      reset();
    },
    [reset],
  );

  const filteredDateChange = useCallback(
    (e) => {
      onChange('filteredDate', e);
    },
    [onChange],
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
      <div className={style.main}>
        <div className={style.header}>
          <span className={style.headerText}>Filters</span>
          <div alt="" onClick={handleDrawerClose} className={style.hover1}>
            <Icon name={'CrossIcon'} />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        <form className={style.body} style={{ height: '90vh', overflowY: 'auto' }}>
          <div className={style.bottom}>
            <div className={style.gridOne} style={{ marginTop: '10px' }}>
              <div>
                <SelectBox
                  options={[
                    { label: 'Screenshot', value: 'Screenshot', checkbox: true },
                    { label: 'Recording', value: 'Recording', checkbox: true },
                    { label: 'Instant Replay', value: 'Instant Replay', checkbox: true },
                  ]}
                  label={'Type'}
                  name={'type'}
                  control={control}
                  placeholder="Select"
                  numberBadgeColor={'#39695b'}
                  dynamicClass={style.zDynamicState3}
                  showNumber
                  isMulti
                />
              </div>
            </div>

            <div className={style.dateDiv}>
              <DateRange
                handleChange={filteredDateChange}
                startDate={watch('filteredDate')?.start}
                endDate={watch('filteredDate')?.end}
                label="Reported Date"
                placeholder="Select"
                name="filteredDate"
                control={control}
              />
            </div>

            <div className={style.resetDiv} style={{ marginTop: '10px' }}>
              <Button
                text={'Reset'}
                type="button"
                btnClass={style.reset}
                style={{ marginRight: '10px', marginLeft: '10px' }}
                onClick={handleReset}
              />
              <Button text={'Apply'} type="button" btnClass={style.applyClass} onClick={handleFilterApply} />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default FiltersDrawer;
