import { useCallback, useState } from 'react';

import { useAppContext } from 'context/app-context';

import SelectBox from 'components/select-box';
import Button from 'components/button';
import DateRange from 'components/date-range';
import Permissions from 'components/permissions';

import { useActivityOptions } from './helper';
import style from './filter-drawer.module.scss';
import Icon from '../../../components/icon/themed-icon';
import SideModal from '../../../components/side-modal';

const FiltersDrawer = ({ setDrawerOpen, control, watch, noHeader, setValue, reset, onFilterApply }) => {
  const { data = {} } = useActivityOptions();
  const { activityBy = [], activityType = [] } = data;
  const [, setSelectedDates] = useState();

  const { userDetails } = useAppContext();

  const onChange = useCallback(
    (name, dates) => {
      const [start, end] = dates;
      setSelectedDates((pre) => ({ ...pre, [name]: { start, end } }));
      setValue(name, { start, end });
    },
    [setValue],
  );

  const handleDrawerClose = useCallback(() => {
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

  const handleFilterApply = useCallback(
    (e) => {
      e.preventDefault();
      const data = watch();
      onFilterApply(data);
    },
    [watch, onFilterApply],
  );

  const handleChange = useCallback(
    (e) => {
      onChange('activityAt', e);
    },
    [onChange],
  );

  return (
    <>
      <SideModal filterMode open={true} handleClose={setDrawerOpen} className={style.main}>
        <div className={style.main}>
          <div className={style.header}>
            <span className={style.headerText}>Filters</span>
            <div id="filtersDrawer" alt="" onClick={handleDrawerClose} className={style.hover1}>
              <Icon name={'CrossIcon'} />
              <div className={style.tooltip}>
                <p>Close</p>
              </div>
            </div>
          </div>
          <div className={style.body} style={{ height: noHeader && '78%' }}>
            <div>
              <div className={style.statusBar}>
                <Permissions allowedRoles={['Admin']} currentRole={userDetails.role}>
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
                </Permissions>
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
              <div className={style.statusBar}>
                <div className={style.dateSingle}>
                  <DateRange
                    handleChange={handleChange}
                    startDate={watch('activityAt')?.start}
                    endDate={watch('activityAt')?.end}
                    label={'Activity Date'}
                    placeholder={'Select'}
                    name={'activityAt'}
                    control={control}
                  />
                </div>
              </div>
            </div>
            <div className={style.resetDiv}>
              <Button text={'Reset'} type="button" btnClass={style.reset} onClick={handleReset} />
              <Button text={'Apply'} type="button" btnClass={style.applyClass} onClick={handleFilterApply} />
            </div>
          </div>
        </div>
      </SideModal>
    </>
  );
};

export default FiltersDrawer;
