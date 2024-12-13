import SelectBox from 'components/select-box';
import DateRange from 'components/date-range';

import style from './reset.module.scss';

const ResetPopup = ({ control, watch, options, onChange }) => {
  const { severityOptions, bugByOptions, testTypeOptions, reportedByOptions, assignedToOptions } = options;

  return (
    <>
      <div className={style.statusBar} style={{ zIndex: '94' }}>
        <div className={style.textField}>
          <SelectBox
            options={severityOptions}
            label={'Severity'}
            placeholder="Select"
            name={'severity'}
            control={control}
            numberBadgeColor={'#39695b'}
            showNumber
            isMulti
          />
        </div>
      </div>
      <div className={style.statusBar} style={{ zIndex: '93' }}>
        <div className={style.datePicker}>
          <SelectBox
            options={testTypeOptions}
            label={'Testing Type'}
            placeholder="Select"
            name={'testingType'}
            control={control}
            numberBadgeColor={'#39695b'}
            showNumber
            isMulti
          />
        </div>
      </div>
      <div className={style.statusBar} style={{ zIndex: '92' }}>
        <div className={style.textField}>
          <SelectBox
            options={reportedByOptions}
            label={'Reported By'}
            placeholder="Select"
            name={'reportedBy'}
            control={control}
            numberBadgeColor={'#39695b'}
            showNumber
            isMulti
          />
        </div>
      </div>
      <div className={style.statusBar} style={{ zIndex: '91' }}>
        <SelectBox
          options={bugByOptions}
          label={'Developer'}
          name={'bugBy'}
          placeholder="Select"
          control={control}
          numberBadgeColor={'#39695b'}
          showNumber
          isMulti
        />
      </div>
      <div className={style.statusBar} style={{ zIndex: '90' }}>
        <div className={style.datePicker}>
          <SelectBox
            options={[...assignedToOptions, { checkbox: true, label: 'Unassigned', value: 'Unassigned' }]}
            label={'Assigned To'}
            name={'assignedTo'}
            placeholder="Select"
            control={control}
            numberBadgeColor={'#39695b'}
            showNumber
            isMulti
          />
        </div>
      </div>
      <div className={style.statusBar} style={{ zIndex: '89' }}>
        <div className={style.datePicker}>
          <DateRange
            handleChange={(e) => onChange('reportedAt', e)}
            startDate={watch('reportedAt')?.start}
            endDate={watch('reportedAt')?.end}
            label="Reported Date"
            placeholder="Select"
            name="reportedAt"
            control={control}
          />
        </div>
      </div>
      <div className={style.statusBar} style={{ zIndex: '88' }}>
        <div className={style.datePicker}>
          <DateRange
            handleChange={(e) => onChange('closedDate', e)}
            startDate={watch('closedDate')?.start}
            endDate={watch('closedDate')?.end}
            label="Closed Date"
            placeholder="Select"
            name="closedDate"
            control={control}
          />
        </div>
      </div>
      <div className={style.statusBar} style={{ zIndex: '87' }}>
        <div className={style.datePicker}>
          <DateRange
            handleChange={(e) => onChange('reTestDate', e)}
            startDate={watch('reTestDate')?.start}
            endDate={watch('reTestDate')?.end}
            label="Retest Date"
            placeholder="Select"
            name="reTestDate"
            control={control}
          />
        </div>
      </div>
    </>
  );
};

export default ResetPopup;
