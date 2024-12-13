import { useCallback, useRef } from 'react';

import style from './input.module.scss';

const TextField = ({
  searchField,
  id,
  ref,
  type,
  icon,
  name,
  label,
  value,
  onClick,
  clearIcon,
  onClear,
  register,
  readOnly,
  onChange,
  className,
  isDisable,
  iconClass,
  wraperClass,
  placeholder,
  errorMessage,
  onClickHandle,
  defaultValue,
  backCompo,
  onEnter,
  required,
  maxVal,
  startIconClass,
  minVal,
  beforeIcon,
  searchIcon,
  ...restOfProps
}) => {
  const textRef = useRef();

  const onClearFunc = useCallback(() => {
    onClear();
    if (textRef.current) textRef.current.value = '';
  }, [onClear]);

  const inputOnClickHandler = useCallback(
    (e) => {
      !onClickHandle && e.stopPropagation();
    },
    [onClickHandle],
  );

  return (
    <>
      <div className={`${style.inputContainer} ${wraperClass} `}>
        {label && (
          <label>
            {label}
            {required && <div></div>}
          </label>
        )}
        <div className={`${style.inputWrapper} ${className}`} onClick={onClickHandle}>
          <input
            id={searchField ? 'searchField' : id}
            ref={ref ? ref : textRef}
            style={{
              border: errorMessage ? '1px solid #ff5050' : '',
              backgroundColor: readOnly || isDisable ? 'transparent' : '',
            }}
            onClick={inputOnClickHandler}
            min={minVal}
            name={name}
            max={maxVal}
            value={value}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            {...(register && { ...register(name) })}
            onKeyDown={onEnter && onEnter}
            defaultValue={defaultValue}
            readOnly={readOnly || false}
            disabled={isDisable || false}
            {...restOfProps}
            autoComplete="off"
            step={'any' || restOfProps.step}
          />

          {beforeIcon && (
            <div className={`${style.beforeIcon} ${iconClass}`} onClick={onClick}>
              {beforeIcon}
            </div>
          )}

          {clearIcon && textRef?.current?.value && (
            <img
              className={`${style.crossIcon} ${iconClass}`}
              style={{ marginRight: searchField && '20px' }}
              src={clearIcon}
              alt=""
              onClick={onClearFunc}
            />
          )}
          {icon && (
            <img
              className={`${style.icon} ${iconClass} ${startIconClass}`}
              src={icon}
              alt=""
              onClick={onClick}
              data-cy="login-form-password-eye-icon"
            />
          )}
          {searchIcon && (
            <svg
              onClick={onClick}
              data-cy="login-form-password-eye-icon"
              className={`${style.icon} ${iconClass} ${startIconClass}`}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                stroke="#8B909A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.9996 14.0001L11.0996 11.1001"
                stroke="#8B909A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {backCompo && (
            <div className={`${style.icon} ${iconClass}`} onClick={onClick}>
              {backCompo}
            </div>
          )}
        </div>
        {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
      </div>
    </>
  );
};

export default TextField;
