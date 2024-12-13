import SelectBox from 'components/select-box';
import DatePicker from 'components/date-picker';

import style from './reset.module.scss';
import { locationOptions } from '../helper';

const ResetPopup = ({ control }) => {
  return (
    <form className={style.resetPopUp}>
      <div className={style.grid}>
        <div className={style.textField}>
          <SelectBox
            options={locationOptions}
            label={'Milestone'}
            name={'milestone'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>

        <div className={style.datePicker}>
          <SelectBox
            options={locationOptions}
            label={'Feature'}
            name={'feature'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>

        <div className={style.textField}>
          <SelectBox
            options={locationOptions}
            label={'Testing Type'}
            name={'testingType'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>

        <div className={style.statusBar}>
          <SelectBox
            options={locationOptions}
            label={'Reported By'}
            name={'reportedBy'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div className={style.datePicker}>
          <SelectBox
            options={locationOptions}
            label={'Bug By'}
            name={'bugBy'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div className={style.statusBar}>
          <SelectBox
            options={locationOptions}
            label={'Assigned To'}
            name={'assignedTo'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>

        <div className={style.statusBar}>
          <DatePicker
            id="checkInTime"
            control={control}
            label={'Closed Date'}
            placeholder={'Select'}
            name={'hello world'}
          />
        </div>

        <div className={style.statusBar}></div>
      </div>
    </form>
  );
};

export default ResetPopup;
