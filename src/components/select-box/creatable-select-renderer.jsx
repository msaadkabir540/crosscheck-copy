import { memo, useCallback } from 'react';

import { isEqual } from 'lodash';
import CreatableSelect from 'react-select/creatable';

import style from './box.module.scss';

const CreatableSelectRenderer = ({
  id,
  field,
  options,
  isLoading,
  backValue,
  isMenuOpen,
  isEditMode,
  isClearable,
  placeholder,
  tooltipText,
  handleCreate,
  errorMessage,
  dynamicClass,
  colourStyles,
  backInputClass,
  onCreatableSelectChange,
}) => {
  const createHandler = useCallback((value) => handleCreate(value, field.onChange), [handleCreate, field]);

  const changeHandler = useCallback(
    (newValue) => onCreatableSelectChange(newValue, field),
    [field, onCreatableSelectChange],
  );

  return (
    <div data-cy={id}>
      <CreatableSelect
        options={options}
        value={field.value}
        isLoading={isLoading}
        isDisabled={isLoading}
        onChange={changeHandler}
        isClearable={isClearable}
        placeholder={placeholder}
        onCreateOption={createHandler}
        styles={colourStyles(false, isEditMode, field?.value, backInputClass, backValue, errorMessage)}
        className={`${style.selectClass} ${dynamicClass}`}
      />
      {!isMenuOpen && tooltipText ? (
        <div className={style.tooltip}>
          <div className={style.tooltipChild}>
            <p className={style.tooltipText}>{tooltipText}</p>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default memo(CreatableSelectRenderer, (prevProps, nextProps) => isEqual(prevProps, nextProps));
