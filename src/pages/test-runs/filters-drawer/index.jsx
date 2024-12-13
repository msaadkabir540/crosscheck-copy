import { useCallback } from 'react';

import PropTypes from 'prop-types';

import SelectBox from 'components/select-box';
import Button from 'components/button';
import DateRange from 'components/date-range';

import { useProjectOptions } from '../helper';
import style from './filter-drawer.module.scss';
import Icon from '../../../components/icon/themed-icon';
import SideModal from '../../../components/side-modal';

const FiltersDrawer = ({ setDrawerOpen, control, isDirty, watch, noHeader, setValue, reset, onFilterApply }) => {
  const { data = {} } = useProjectOptions();
  const { statusOptions = [], createdByOptions = [], assignedTo = [] } = data;

  const onChange = useCallback(
    (name, dates) => {
      const [start, end] = dates;

      setValue(name, { start, end });
    },
    [setValue],
  );

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, [setDrawerOpen]);

  const handleDueDateChange = useCallback(
    (e) => {
      onChange('dueDate', e);
    },
    [onChange],
  );

  const handleCreatedAtChange = useCallback(
    (e) => {
      onChange('createdAt', e);
    },
    [onChange],
  );

  const handleResetFilters = useCallback(
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
            <div id="filtersDrawer" alt="" onClick={handleDrawerClose} className={style.hover1}>
              <Icon name={'CrossIcon'} />
              <div className={style.tooltip}>
                <p>Close</p>
              </div>
            </div>
          </div>

          <form className={style.body} style={{ height: noHeader ? '78vh' : '90vh' }}>
            <div className={style.bottom} data-cy="filter-modal-testrun">
              <div className={style.gridTwo}>
                <div>
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
                    id="testrun-filtermodal-status-selectbox"
                  />
                </div>
                <div>
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
                    id="testrun-filtermodal-assignedto-selectbox"
                  />
                </div>
              </div>
              <div className={style.gridTwo}>
                <div className={style.dateDiv}>
                  <DateRange
                    handleChange={handleDueDateChange}
                    startDate={watch('dueDate')?.start}
                    endDate={watch('dueDate')?.end}
                    label={'Due Date'}
                    name={'dueDate'}
                    placeholder={'Select'}
                    popperPlacement={'auto'}
                    control={control}
                    className={style.dateRange}
                    id="testrun-filtermodal-duedate"
                  />
                </div>
                <div className={style.dateDiv}>
                  <DateRange
                    handleChange={handleCreatedAtChange}
                    startDate={watch('createdAt')?.start}
                    endDate={watch('createdAt')?.end}
                    position={'leftDown'}
                    label={'Created Date'}
                    name={'createdAt'}
                    placeholder={'Select'}
                    control={control}
                    className={style.dateRange}
                    id="testrun-filtermodal-createdate"
                  />
                </div>
              </div>
              <div className={style.createdByClass}>
                <div>
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
                    id="testrun-filtermodal-createdby-selectbox"
                  />
                </div>
              </div>

              <div className={style.resetDiv}>
                <Button
                  text={'Reset'}
                  type="button"
                  btnClass={style.reset}
                  onClick={handleResetFilters}
                  disabled={!isDirty}
                  data-cy="testrun-filtermodal-resetbtn"
                />
                <Button
                  text={'Apply'}
                  type="button"
                  btnClass={style.applyClass}
                  onClick={handleFilterApply}
                  data-cy="testrun-filtermodal-applybtn"
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
  setDrawerOpen: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  watch: PropTypes.func.isRequired,
  noHeader: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  onFilterApply: PropTypes.func.isRequired,
};

export default FiltersDrawer;
