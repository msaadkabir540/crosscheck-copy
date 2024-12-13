import { useCallback } from 'react';

import SelectBox from 'components/select-box';
import Icon from 'components/icon/themed-icon';
import RadioButtons from 'components/form-fields/radio-buttons';

import style from '../add.module.scss';

const StatusChangeContainer = ({
  title,
  watch,
  errors,
  control,
  keepText,
  statusArr,
  radioName,
  changeText,
  statusOptions,
  handleBulkStatusSelect,
}) => {
  const handleSelect = useCallback(
    ({ selectedOption, field }) => {
      handleBulkStatusSelect({ selectedOption, field, radioName });
    },
    [handleBulkStatusSelect, radioName],
  );

  return (
    <div>
      <p className={style.heading}>{title}</p>
      <div className={style.checkBoxDiv}>
        <RadioButtons
          name={radioName}
          control={control}
          containerClass={style.radioBtns}
          options={[
            { value: 'keep', label: keepText },
            { value: 'change', label: changeText },
          ]}
        />
      </div>
      {watch(radioName) === 'change' && (
        <div className={style.changeStatusDiv}>
          <div className={style.statusHead}>
            <div className={style.statusContainer}>
              <p className={style.headerText}>Current Status</p>
            </div>
            <div className={style.iconClass}>
              <Icon name={''} height={24} width={24} />
            </div>
            <div className={style.statusContainer}>
              <p className={style.headerText}>New Status</p>
            </div>
          </div>
          {statusArr.map(({ name, count, status }) => {
            return (
              <div className={style.statusHead} key={name}>
                <div className={style.statusContainer}>
                  <p>{status}</p>
                  <p>{count}</p>
                </div>
                <div className={style.iconClass}>
                  <Icon name={'ArrowRight'} height={24} width={24} />
                </div>
                <div className={style.statusContainer}>
                  <SelectBox
                    showNumber
                    name={name}
                    control={control}
                    placeholder="Select"
                    onChange={handleSelect}
                    options={statusOptions}
                    numberBadgeColor={'#39695b'}
                    errorMessage={errors?.bugStatus?.message}
                    id={'add-version-tested-environment-dropdown'}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StatusChangeContainer;
