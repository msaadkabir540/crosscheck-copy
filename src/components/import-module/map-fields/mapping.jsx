import { useCallback, useMemo, useState } from 'react';

import TextField from 'components/text-field';
import SelectBox from 'components/select-box';

import UpdateMappingModal from '../modal-update-mapping';
import style from './mapFields.module.scss';
import { countValuesForKey } from './helper';
import Icon from '../../icon/themed-icon';

const Mapping = ({
  control,
  setValue,
  watch,
  field,
  headerOptions,
  getValues,
  name,
  onChangeHandler,
  OnRecordUpdateHandler,
}) => {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const formattedHeaderOptions = useMemo(() => {
    return headerOptions.map((option) => ({
      ...option,
      label: option.label.replace(/([a-z])([A-Z])/g, '$1 $2'),
    }));
  }, [headerOptions]);

  const updateModalTrue = useCallback(() => setOpenUpdateModal(true), []);

  return (
    <div className={style.mappingField}>
      {openUpdateModal && (
        <UpdateMappingModal
          {...{
            openUpdateModal,
            setOpenUpdateModal,
            crossCheckField: field,
            control,
            setValue,
            watch,
            getValues,
            OnRecordUpdateHandler,
          }}
        />
      )}
      <>
        <TextField value={field?.label} className={style.textFieldControl} readOnly={true} />
        <div className={style.arrowIcon}>
          <Icon name={'ArrowRight'} />
        </div>
        <div className={style.selectFieldControl}>
          <SelectBox
            control={control}
            dynamicWrapper={style.dynamicWrapper}
            watch={watch}
            name={name}
            defaultValue={field.assignedValue ? { label: field.assignedValue, value: field.assignedValue } : null}
            options={formattedHeaderOptions}
            placeholder="Select"
            isClearable={true}
            onChange={onChangeHandler}
          />
        </div>
      </>
      {field?.assignedValue ? (
        field.shouldAutoMap ? (
          field.csvValues.length ? (
            <div className={style.mappingOutput}>
              <p>
                {countValuesForKey(field.csvValues, 'assignedValue')} Values Mapped
                {field.name === 'features' ? (
                  getValues('crossCheckFields')['milestones']?.assignedValue ? (
                    <span onClick={updateModalTrue}> (Update)</span>
                  ) : (
                    <span> (Map Milestone Header First)</span>
                  )
                ) : (
                  <span onClick={updateModalTrue}> (Update)</span>
                )}
              </p>
              {field.csvValues.length > countValuesForKey(field.csvValues, 'assignedValue') && (
                <span> Mapping Required</span>
              )}
            </div>
          ) : (
            <div className={style.mappingOutput}>
              <p>No Record Found in CSV </p>
            </div>
          )
        ) : (
          <div className={style.mappingOutput}>
            <p>No Mapping Required</p>
          </div>
        )
      ) : (
        <div className={style.mappingOutput}>
          <p>Map the Column First</p>
        </div>
      )}
    </div>
  );
};

export default Mapping;
