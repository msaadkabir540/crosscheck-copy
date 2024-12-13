import { useCallback, useRef, useState } from 'react';

import ReactDatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';

import doubleArrowRight from 'assets/1.svg';
import singleArrowRight from 'assets/2.svg';
import singleArrowLeft from 'assets/3.svg';
import doubleArrowLeft from 'assets/4.svg';

import style from './date.module.scss';
import './index.css';
import 'react-datepicker/dist/react-datepicker.css';
import Icon from '../icon/themed-icon';

const DatePicker = ({
  readOnly,
  name,
  control,
  label,
  className,
  id,
  popperPlacement,
  errorMessage,
  defaultVal,
  handleChange,
  isDisable,
  handleClick,
  showTimeInput,
  maxDate,
  minDate,
  placeholder,
  star,
  backClass,
  rules,
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef(null);

  const handleChangeDate = (event, onChange, name) => {
    handleChange?.(event, name);
    onChange(event);
    setIsDatePickerOpen(false);
  };

  const toggleDatePicker = (isOpen) => {
    setIsDatePickerOpen(isOpen);
  };

  const closeDatePicker = useCallback(() => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(false);
    }

    setIsDatePickerOpen(false);
  }, []);

  const toggleDatePickerTrue = useCallback(() => toggleDatePicker(true), []);
  const toggleDatePickerFalse = useCallback(() => toggleDatePicker(false), []);

  return (
    <>
      <div className={`${style.main} ${className}`}>
        {label && (
          <label className={style.label}>
            {label}
            <b>{star}</b>
          </label>
        )}
        <div onClick={handleClick} className={style.controllerWrapper}>
          {isDatePickerOpen && <div className={style.backdrop} onClick={closeDatePicker} />}
          <Controller
            name={name}
            control={control}
            defaultValue={defaultVal || null}
            rules={rules}
            // eslint-disable-next-line react/jsx-no-bind
            render={({ field: { onChange, value, name } }) => {
              return (
                <ReactDatePicker
                  ref={datePickerRef}
                  popperClassName={backClass}
                  previousMonthAriaLabel={style.classRed}
                  selected={value == 'Invalid Date' ? null : value || null}
                  maxDate={maxDate && maxDate}
                  minDate={minDate && minDate}
                  popperPlacement={popperPlacement}
                  readOnly={readOnly}
                  dateFormat={showTimeInput ? 'MM/dd/yyyy h:mm aa' : 'MM/dd/yyyy'}
                  timeFormat="HH:mm"
                  timeCaption="Time"
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={(event) => {
                    handleChangeDate(event, onChange, name);
                  }}
                  className={errorMessage ? style.borderClass : style.inpDiv}
                  placeholderText={placeholder ? placeholder : '22/03/2022'}
                  id={id}
                  disabled={isDisable}
                  onCalendarOpen={toggleDatePickerTrue}
                  isClearable
                  onCalendarClose={toggleDatePickerFalse}
                  // eslint-disable-next-line react/jsx-no-bind
                  renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                    prevYearButtonDisabled,
                    nextYearButtonDisabled,
                    increaseYear,
                    decreaseYear,
                  }) => (
                    <div className={style.iconsDiv}>
                      <div>
                        <button
                          className={style.marginLeftTen}
                          type="button"
                          onClick={decreaseYear}
                          disabled={prevYearButtonDisabled}
                        >
                          <img src={doubleArrowLeft} alt="" />
                        </button>
                        <button type={'button'} onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                          <img src={singleArrowLeft} alt="" />
                        </button>
                      </div>
                      <p>
                        {months[new Date(date)?.getMonth()]} {new Date(date)?.getFullYear()}
                      </p>
                      <div>
                        <button type={'button'} onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                          <img src={singleArrowRight} alt="" />
                        </button>
                        <button
                          type={'button'}
                          onClick={increaseYear}
                          disabled={nextYearButtonDisabled}
                          className={style.marginRightZero}
                        >
                          <img src={doubleArrowRight} alt="" />
                        </button>
                      </div>
                    </div>
                  )}
                />
              );
            }}
          />
          <label htmlFor={id} className={style.labelDate}>
            <div className={style.icon}>
              <Icon name={'DatePickerIcon'} />
            </div>
          </label>
        </div>
        {errorMessage ? <span className={style.errorMessage}>{errorMessage}</span> : ''}
      </div>
    </>
  );
};

export default DatePicker;

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
