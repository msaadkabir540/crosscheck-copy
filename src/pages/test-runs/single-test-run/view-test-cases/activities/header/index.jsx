import PropTypes from 'prop-types';

import Button from 'components/button';
import SelectBox from 'components/select-box';
import DateRange from 'components/date-range';

import { formattedDate } from 'utils/date-handler';

import style from './header.module.scss';
import { useActivityOptions } from './helper';

const FilterHeader = ({ control, setValue, watch, handleSubmit, reset, onSubmit, onReset }) => {
  const { data = {} } = useActivityOptions();
  const { activityBy = [], activityType = [] } = data;

  const onChange = (name, dates) => {
    const [start, end] = dates;

    setValue(name, { start, end });

    setValue('activityAtStart', formattedDate(new Date(start), 'yyyy-MM-dd'));
    setValue('activityAtEnd', formattedDate(new Date(end), 'yyyy-MM-dd'));
  };

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
            <div className={style.statusBar}>
              <SelectBox
                options={activityBy}
                name="activityBy"
                control={control}
                badge
                label={'Activity By'}
                placeholder={'Select'}
                numberBadgeColor={'#39695b'}
                dynamicClass={style.zDynamicState5}
                showNumber
              />
            </div>
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
                onClick={(e) => {
                  e.preventDefault();
                  reset();
                  onReset();
                }}
              />
              <Button text={'Apply'} type="submit" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

FilterHeader.propTypes = {
  control: PropTypes.any.isRequired,
  setValue: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};
export default FilterHeader;
