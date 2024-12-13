import { useCallback, useMemo } from 'react';

import SelectBox from 'components/select-box';
import TextArea from 'components/text-area';
import TextField from 'components/text-field';
import DatePicker from 'components/date-picker';

import style from './custom-fields.module.scss';

const CustomFields = ({ fields, control, register, people }) => {
  const sortedFields = useMemo(() => {
    return fields?.slice().sort((a) => (a.type === 'text' ? 1 : -1));
  }, [fields]);

  return (
    <div className={style.main}>
      {sortedFields?.map((e) => (
        <div className={style.singleField} key={e?.id}>
          <div className={style.left} style={{ border: e?.type === 'text' && 'none' }}>
            <h6>{e?.name}</h6>
          </div>
          <div className={style.right}>
            <RenderField field={e} control={control} register={register} people={people} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomFields;

const RenderField = ({ field, control, people, register }) => {
  const handleRegister = useCallback(() => register(`field-${field?.name}`), [field?.name, register]);

  switch (field?.type) {
    case 'drop_down':
    case 'users':
    case 'labels':
      return (
        <SelectBox
          options={
            field?.type === 'users'
              ? people
              : (field?.type_config &&
                  field?.type_config?.options?.map((x) => ({
                    label: x.name || x.label,
                    value: x.name || x.label,
                    id: x.id,
                  }))) ||
                []
          }
          name={field?.type === 'users' ? `user-field-${field?.name}` : `field-${field?.name}`}
          control={control}
          placeholder="Select"
          dynamicWrapper={style.selectBox}
          isMulti={field?.type === 'labels'}
          showNumber={field?.type === 'labels'}
          badge
        />
      );
    case 'email':
    case 'number':
    case 'short_text':
      return (
        <TextField
          name={`field-${field?.name}`}
          type={field.type === 'short_text' ? 'text' : field.type}
          wraperClass={style.textField}
          register={handleRegister}
          placeholder="-"
        />
      );
    case 'text':
      return (
        <TextArea
          name={`field-${field?.name}`}
          row={5}
          className={style.textArea}
          register={handleRegister}
          placeholder="-"
        />
      );
    case 'date':
      return (
        <DatePicker
          control={control}
          name={`field-${field?.name}`}
          className={style.dateClass}
          placeholder={'Select'}
        />
      );
    default:
      return null;
  }
};
