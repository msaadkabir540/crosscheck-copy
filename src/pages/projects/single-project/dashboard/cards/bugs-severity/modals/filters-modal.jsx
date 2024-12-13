import { useCallback } from 'react';

// NOTE: components
import Modal from 'components/modal';
// NOTE: utils
// NOTE: styles
import SelectBox from 'components/select-box';
import Button from 'components/button';
import DateRange from 'components/date-range';

import style from './style-modal.module.scss';
import { useBugsFiltersOptions } from '../../../helper';
import Icon from '../../../../../../../components/icon/themed-icon';

const FiltersModal = ({ open, setOpen, setValue, reset, projectId, watch, className, control, onFilterApply }) => {
  const { data = {} } = useBugsFiltersOptions();

  const onChange = useCallback(
    (dates) => {
      const [start, end] = dates;
      setValue('reportedAt', { start, end });
    },
    [setValue],
  );

  const {
    mileStonesOptions = [],
    featuresOptions = [],
    bugTypeOptions = [],
    testTypeOptions = [],
    reportedByOptions = [],
    developersOptions = [],
    assignedToOptions = [],
    statusOptions = [],
  } = data;

  const handleFormReset = useCallback(
    (e) => {
      e.preventDefault();
      reset();
      setValue('reportedAt', { start: '', end: '' });
    },
    [reset, setValue],
  );

  const handleFilterApply = useCallback(
    (e) => {
      e.preventDefault();
      onFilterApply();
    },
    [onFilterApply],
  );

  return (
    <Modal open={open} handleClose={setOpen} className={`${style.modalClass} ${className && className}`}>
      <div className={style.crossImg}>
        <span className={style.modalTitle}>Apply Filters</span>
        <div onClick={setOpen} className={style.hover}>
          <Icon name={'CrossIcon'} iconClass={style.icon} />
        </div>
      </div>
      <div className={style.filtersGrid}>
        <div>
          <SelectBox
            options={mileStonesOptions.filter((x) => x.projectId === projectId)}
            label={'Milestone'}
            placeholder={'Select'}
            name={'milestones'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div>
          <SelectBox
            options={
              projectId
                ? featuresOptions.filter((x) => watch('milestones')?.includes(x.milestoneId))
                : featuresOptions.filter((x) => watch('milestones')?.includes(x.milestoneId))
            }
            label={'Feature'}
            placeholder={'Select'}
            name={'features'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div>
          <SelectBox
            options={testTypeOptions}
            label={'Testing Type'}
            placeholder={'Select'}
            name={'testingType'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div>
          <SelectBox
            options={statusOptions}
            label={'Status'}
            placeholder={'Select'}
            name={'status'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>

        <div>
          <SelectBox
            options={developersOptions}
            label={'Developer'}
            placeholder={'Select'}
            name={'developers'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div>
          <SelectBox
            options={reportedByOptions}
            label={'Reported By'}
            placeholder={'Select'}
            name={'reportedBy'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div>
          <DateRange
            handleChange={onChange}
            startDate={watch('reportedAt')?.start}
            endDate={watch('reportedAt')?.end}
            label={'Reported Date'}
            name={'reportedAt'}
            placeholder={'Select'}
            control={control}
          />
        </div>
        <div>
          <SelectBox
            options={bugTypeOptions}
            label={'Bugs Type'}
            placeholder={'Select'}
            name={'bugType'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div>
          <SelectBox
            options={assignedToOptions}
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
      </div>
      <div className={style.resetDiv}>
        <Button text={'Reset'} type="button" btnClass={style.reset} onClick={handleFormReset} />
        <Button text={'Apply'} type="button" btnClass={style.applyClass} onClick={handleFilterApply} />
      </div>
    </Modal>
  );
};

export default FiltersModal;
