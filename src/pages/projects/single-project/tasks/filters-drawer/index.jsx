import { useCallback, useState } from 'react';

import SelectBox from 'components/select-box';
import Button from 'components/button';
import DateRange from 'components/date-range';

import { useProjectOptions } from './helper';
import style from './filter-drawer.module.scss';
import Icon from '../../../../../components/icon/themed-icon';
import SideModal from '../../../../../components/side-modal';

const FiltersDrawer = ({ isDirty, setDrawerOpen, control, watch, noHeader, setValue, reset, onFilterApply }) => {
  const { data = {} } = useProjectOptions();

  const { applicationOptions = [], createdByOptions = [], taskTypeOptions = [], assignedTo = [] } = data;
  const [, setSelectedDates] = useState();

  const onChange = useCallback(
    (name, dates) => {
      const [start, end] = dates;

      setSelectedDates((pre) => ({ ...pre, [name]: { start, end } }));
      setValue(name, { start, end });
    },
    [setSelectedDates, setValue],
  );

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, [setDrawerOpen]);

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
      setDrawerOpen(false);
    },
    [reset, setDrawerOpen],
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
      <SideModal filterMode open={true} handleClose={setDrawerOpen} className={style.main}>
        <div className={style.main}>
          <div className={style.header}>
            <span className={style.headerText}>Filters</span>
            <div id="filtersDrawer" alt="" onClick={closeDrawer} className={style.hover1}>
              <Icon name={'CrossIcon'} />
              <div className={style.tooltip}>
                <p>Close</p>
              </div>
            </div>
          </div>
          <div className={style.body} style={{ height: noHeader && '78%' }}>
            <div className={style.inner}>
              <div className={style.statusBar}>
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
              <div className={style.statusBar}>
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
                />{' '}
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
              </div>{' '}
              <div className={style.statusBar}>
                <div className={style.dateSingle}>
                  <DateRange
                    handleChange={handleCreatedAtChange}
                    startDate={watch('createdAt')?.start}
                    endDate={watch('createdAt')?.end}
                    label={'Created Date'}
                    name={'createdAt'}
                    placeholder={'Select'}
                    control={control}
                  />
                </div>
              </div>
            </div>
            <div className={style.resetDiv}>
              <Button
                disabled={!isDirty}
                text={'Reset'}
                type="button"
                btnClass={style.reset}
                onClick={handleResetForm}
              />
              <Button text={'Apply'} type="button" btnClass={style.applyClass} onClick={handleFilterApply} />
            </div>
          </div>
        </div>
      </SideModal>
    </>
  );
};

export default FiltersDrawer;
