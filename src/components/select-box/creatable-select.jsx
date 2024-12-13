import { useState, useRef, useEffect, useCallback } from 'react';

import chroma from 'chroma-js';
import { Controller } from 'react-hook-form';
import _ from 'lodash';

import CreatableSelectRenderer from './creatable-select-renderer';
import style from './box.module.scss';
import './style.scss';

const useOutsideAlerter = (ref) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        // NOTE: setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};

const CreatableSelectComponent = ({
  defaultOptions = [],
  dynamicWrapper,
  label,
  errorMessage,
  control,
  dynamicClass,
  defaultValue,
  rules,
  isClearable,
  disabled,
  id,
  showValueOnlyOnDisabled,
  name,
  isEditMode,
  placeholder,
  backInputClass,
  optionAttr,
  index,
  backValue,
  onChangeHandler,
  allowSetValue = true,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setIsMenuOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(defaultOptions);

  useEffect(() => {
    setOptions(defaultOptions);
  }, [defaultOptions]);

  const handleCreate = useCallback(
    (inputValue, setValue) => {
      setIsLoading(true);
      setTimeout(() => {
        const newOption = createOption(inputValue);
        setIsLoading(false);
        setOptions((prev) => [...prev, newOption]);
        allowSetValue && setValue(newOption);
        onChangeHandler && onChangeHandler({ selectedOption: newOption, field: name });
      }, 1000);
    },
    [allowSetValue, name, onChangeHandler],
  );

  const onCreatableSelectChange = useCallback(
    (newValue, field) => {
      field.onChange(newValue);
      onChangeHandler && onChangeHandler({ selectedOption: newValue, field: name });
    },
    [name, onChangeHandler],
  );

  const render = useCallback(
    ({ field }) => {
      const tooltipText = _.isArray(field?.value)
        ? field?.value.join(', ')
        : _.isObject(field?.value)
          ? field?.value?.barStatus
          : field?.value;

      return showValueOnlyOnDisabled && disabled ? (
        <div className={style.displayValueOnly}>{field.value}</div>
      ) : (
        <CreatableSelectRenderer
          {...{
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
          }}
        />
      );
    },
    [
      id,
      options,
      disabled,
      backValue,
      isLoading,
      isEditMode,
      isMenuOpen,
      placeholder,
      isClearable,
      dynamicClass,
      errorMessage,
      handleCreate,
      backInputClass,
      showValueOnlyOnDisabled,
      onCreatableSelectChange,
    ],
  );

  const handleCloseMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <>
      <div
        className={`${style.wraper} ${dynamicWrapper && dynamicWrapper}`}
        data-cy={`${optionAttr}${index}`}
        ref={wrapperRef}
      >
        <label className={style.lbl}>{label}</label>
        <div
          className={style.selectBox}
          style={{
            border: errorMessage ? '1px solid var(--red)' : '',
          }}
        >
          {control && (
            <Controller
              name={name}
              control={control}
              rules={rules}
              defaultValue={defaultValue}
              render={render}
            ></Controller>
          )}
        </div>
        {errorMessage ? <span className={style.errorMessage}>{errorMessage}</span> : ''}
      </div>
      {isMenuOpen && <div className={style.backdropDiv} onClick={handleCloseMenu}></div>}
    </>
  );
};

export default CreatableSelectComponent;

const createOption = (label) => ({
  label,
  value: label.replace(/\W/g, ''),
});

const colourStyles = (isMulti, isEditMode, value, backInputClass, backValue, errorMessage) => {
  return {
    control: (styles, { isFocused, isSelected }) => ({
      ...styles,
      background: `var(--bg-a) !important`,
      boxShadow: 'none',
      border: isSelected
        ? '1px solid var(--stroke-b) !important'
        : isFocused && !errorMessage
          ? '1px solid var(--stroke-b) !important'
          : '1px solid var(--stroke-a) !important',
      borderRadius: '5px',
      display: 'flex !important',
      alignItems: 'center !important',
      padding: '0px 10px ',
      minHeight: '35px',
      cursor: 'pointer',
      '&:hover': {
        outline: isFocused ? 0 : 0,
      },
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
      const color = chroma('#333333');

      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : !isMulti && isSelected
            ? '#11103D2A'
            : isFocused
              ? color.alpha(0.1).css()
              : undefined,
        color: isDisabled ? '#ccc' : 'var(--font-a)',

        cursor: isDisabled ? 'not-allowed' : '#fff',
        ':hover': {
          ...styles[':hover'],
          backgroundColor: 'var(--hover)',
        },
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled ? (isSelected ? '#fff' : color.alpha(0.3).css()) : '#fff',
          zIndex: '5000 !important',
        },
      };
    },

    placeholder: (styles) => ({
      ...styles,
      fontSize: '13px',
      color: 'var(--font-e)',
      position: 'absolute',
      fontWeight: 400,
    }),

    multiValue: (styles, { data }) => {
      const color = chroma(data?.color || 'black');

      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
      };
    },
    Input: (styles) => {
      return {
        ...styles,
        color: 'var(--font-e)',
        fontSzie: '11px',
        ...backInputClass,
      };
    },

    multiValueLabel: (styles) => ({
      ...styles,
      color: 'var(--font-e)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',

      textOverflow: 'ellipsis',
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: 'var(--font-e)',
      ':hover': {
        backgroundColor: data?.color || 'black',
        color: 'white',
      },
    }),
    dropdownIndicator: (_, context) => {
      return {
        transform: `rotate(${context.selectProps.menuIsOpen ? '180deg' : '0deg'})`,
        transition: 'transform 0.2s',
        color: 'var(--bg-f)',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      };
    },
    indicatorSeparator: (styles) => {
      return {
        ...styles,
        width: '0px !important',
      };
    },
    clearIndicator: () => {
      return {
        padding: 0,
        marginTop: '5px',
        fill: 'var(--bg-f)',
      };
    },

    valueContainer: (styles) => {
      return {
        ...styles,
        paddingLeft: 0,
        paddingRight: 0,
        display: 'flex',
        color: 'var(--font-a)',
        fontSzie: '11px',

        ...backValue,
      };
    },
    singleValue: (styles) => {
      return {
        ...styles,
        color: 'var(--font-a)',
        fontSzie: '11px !important',
      };
    },

    menu: (styles) => {
      return {
        ...styles,
        zIndex: !isEditMode ? 4 : 1,
        backgroundColor: 'var(--bg-a) !important',
        color: 'var(--font-a) !important',
      };
    },
  };
};
