import { useCallback } from 'react';

import { Controller } from 'react-hook-form';

import style from './style.module.scss';

const Index = ({
  className,
  defaultValue,
  isDisabled,
  options = [],
  label,
  name,
  control,
  containerClass,
  onChangeHandler,
  errorMessage,
}) => {
  return (
    <div className={className && className}>
      {label && <label className={style.label}>{label}</label>}
      <div className={`${style.radioButtons} ${containerClass}`}>
        {options?.map((option) => (
          <FormRadioBtn {...{ option, control, defaultValue, onChangeHandler, isDisabled, name }} key={option.label} />
        ))}
      </div>

      {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
    </div>
  );
};

export default Index;

const FormRadioBtn = ({ option, control, defaultValue, onChangeHandler, isDisabled, name, key }) => {
  const render = useCallback(
    ({ field }) => (
      <label className={style.singleButton}>
        <RadioButton {...{ field, option, isDisabled, onChangeHandler }} />
        {option.label}
      </label>
    ),
    [isDisabled, onChangeHandler, option],
  );

  return (
    <div key={key}>
      <Controller name={name} control={control} defaultValue={defaultValue} render={render} />
    </div>
  );
};

const RadioButton = ({ field, option, isDisabled, onChangeHandler }) => {
  const onChange = useCallback(
    (e) => {
      field.onChange(e);
      onChangeHandler && onChangeHandler(e);
    },
    [onChangeHandler, field],
  );

  return (
    <input
      {...field}
      type="radio"
      onChange={onChange}
      value={option.value}
      disabled={isDisabled}
      checked={field.value === option.value}
    />
  );
};
