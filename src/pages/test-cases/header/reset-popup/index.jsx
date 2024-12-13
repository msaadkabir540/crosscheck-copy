import PropTypes from 'prop-types';

import SelectBox from 'components/select-box';
import DateRange from 'components/date-range';

import style from './reset.module.scss';

const ResetPopup = ({ control, watch, setValue, options }) => {
  const { weighageOptions, testTypeOptions, lastTestedBy } = options;

  const onChange = (name, dates) => {
    const [start, end] = dates;

    setValue(name, { start, end });
  };

  return (
    <>
      <div className={style.statusBar} style={{ zIndex: '95' }}>
        <DateRange
          handleChange={(e) => onChange('createdAt', e)}
          startDate={watch('createdAt')?.start}
          endDate={watch('createdAt')?.end}
          label={'Created at'}
          placeholder={'Select'}
          name={'createdAt'}
          control={control}
          className={style.gapNone}
        />
      </div>
      <div className={style.statusBar} style={{ zIndex: '94' }}>
        <div className={style.textField}>
          <SelectBox
            options={lastTestedBy}
            label={'Last Tested By'}
            name={'lastTestedBy'}
            control={control}
            placeholder="Select"
            numberBadgeColor={'#39695b'}
            showNumber
            isMulti
          />
        </div>
      </div>

      <div className={style.statusBar} style={{ zIndex: '93' }}>
        <DateRange
          handleChange={(e) => onChange('lastTestedAt', e)} // NOTE: startDate={startDate}
          startDate={watch('lastTestedAt')?.start}
          endDate={watch('lastTestedAt')?.end}
          label="Last Tested on"
          name="lastTestedAt"
          control={control}
          placeholder={'Select'}
          className={style.gapNone}
        />
      </div>
      <div className={style.statusBar} style={{ zIndex: '92' }}>
        <SelectBox
          options={testTypeOptions}
          label={'Test Type'}
          name={'testType'}
          control={control}
          placeholder="Select"
          numberBadgeColor={'#39695b'}
          showNumber
          isMulti
          isSearchable={false}
        />
      </div>
      <div className={style.statusBar} style={{ zIndex: '91' }}>
        <div className={style.datePicker}>
          <SelectBox
            options={weighageOptions}
            label={'Weightage'}
            name={'weightage'}
            control={control}
            placeholder="Select"
            numberBadgeColor={'#39695b'}
            showNumber
            isMulti
          />
        </div>
      </div>
      <div className={style.statusBar} style={{ zIndex: '90' }}>
        <div className={style.datePicker}>
          <SelectBox
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Obsolete', value: 'Obsolete' },
            ]}
            label={'State'}
            name={'state'}
            control={control}
            placeholder="Select"
            numberBadgeColor={'#39695b'}
            showNumber
            isMulti
            isSearchable={false}
          />
        </div>
      </div>
    </>
  );
};

ResetPopup.propTypes = {
  control: PropTypes.any.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  options: PropTypes.any.isRequired,
};

export default ResetPopup;
