import ReactDatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';

import doubleArrowRight from 'assets/1.svg';
import singleArrowRight from 'assets/2.svg';
import singleArrowLeft from 'assets/3.svg';
import doubleArrowLeft from 'assets/4.svg';

import style from './date.module.scss';
import './range.css';
import Icon from '../icon/themed-icon';

const DateRange = ({
  star,
  name,
  className,
  id,
  errorMessage,
  handleClick,
  popperPlacement,
  control,
  startDate,
  endDate,
  label,
  position,
  handleChange,
  placeholder,
  isDisabled,
  openBydefault,
}) => {
  const handleChangeDate = (event, name) => {
    handleChange?.(event, name);
  };

  return (
    <div>
      <div className={`${style.main} ${className}`}>
        {label && (
          <label className={style.label}>
            {label} <b>{star}</b>{' '}
          </label>
        )}

        <div
          className={`${
            style.positionRelative
          } ${errorMessage ? style.borderClass : startDate && endDate ? style.selectedBorder : style.borderClass1}`}
          onClick={handleClick}
        >
          <Controller
            name={name}
            control={control}
            // eslint-disable-next-line react/jsx-no-bind
            render={({ onChange, value = null, name }) => {
              return (
                <>
                  <ReactDatePicker
                    open={openBydefault}
                    popperClassName={position === 'leftDown' ? 'date-range-green-left' : 'date-range-green'}
                    selected={value}
                    popperPlacement={popperPlacement}
                    disabled={isDisabled}
                    endDate={endDate && endDate}
                    startDate={startDate && startDate}
                    dateFormat={'MM/dd/yyyy'}
                    // eslint-disable-next-line react/jsx-no-bind
                    onChange={(event) => {
                      handleChangeDate(event, onChange, name);
                    }}
                    className={style.inpDiv}
                    placeholderText={placeholder ? placeholder : '22/03/2022 - 27/09/2022'}
                    id={id}
                    isClearable
                    selectsRange
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
                            className={style.marginLeftZero}
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
                          {months[date.getMonth()]} {date.getFullYear()}
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
                </>
              );
            }}
          />
          <label htmlFor={id} className={style.labelDate}>
            <div className={style.icon}>
              <Icon name={'DateIcon'} />
            </div>
          </label>
        </div>
        {errorMessage ? <span className={style.errorMessage}>{errorMessage}</span> : ''}
      </div>
    </div>
  );
};

export default DateRange;

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
