import { useState, useEffect, useRef } from 'react';

import { Controller } from 'react-hook-form';

import style from './input-range.module.scss';

const InputRangeComponent = ({ name, control, label, dataCY, rules, errorMessage, watch, setValue }) => {
  const [tooltipValue, setTooltipValue] = useState(1);
  const [numPoints, setNumPoints] = useState(1); // NOTE: Change initial value to 0
  const tooltipRef = useRef(null);

  const updateTooltip = (value) => {
    setTooltipValue(value);
    const rangeInput = document.getElementById('points');
    const rangeWidth = rangeInput.offsetWidth;
    const thumbWidth = 20;
    const percent = (value - rangeInput.min) / (rangeInput.max - rangeInput.min);
    const thumbPosition = percent * (rangeWidth - thumbWidth);
    const tooltip = tooltipRef.current;
    tooltip.style.left = `${thumbPosition}px`;
  };

  const updatePoints = (value) => {
    const numPoints = parseInt(value);
    setNumPoints(numPoints);
  };

  useEffect(() => {
    const rangeInput = document.getElementById('points');

    if (rangeInput) {
      rangeInput.addEventListener('change', (e) => {
        // NOTE: Use 'change' event
        const value = e.target.value;
        updateTooltip(value);
        updatePoints(value);
      });
      updateTooltip(rangeInput.value);
      updatePoints(rangeInput.value);
    }
  }, []);

  useEffect(() => {
    // NOTE: When the input value is reset, update the tooltip accordingly
    const currentValue = watch(name);

    if (!currentValue) {
      setValue(name, 1);
    }

    updateTooltip(currentValue || 1);
    updatePoints(currentValue || 1);
  }, [watch(name)]);

  return (
    <>
      <span className={style.label}>{label}</span>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          return (
            <div className={style.rangeContainer}>
              <input
                data-cy={dataCY}
                type="range"
                id="points"
                min={1}
                max={5}
                defaultValue={field.value || 1}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                }}
                style={{
                  background: `linear-gradient(to right, #11103D ${((field.value - 1) / (5 - 1)) * 100}%, #11103D ${
                    ((field.value - 1) / (5 - 1)) * 100
                  }%, rgb(139 144 154 / 40%) ${((field.value - 1) / (5 - 1)) * 100}%, rgb(139 144 154 / 40%))`,
                }}
              />

              <div
                className={style.tooltip}
                style={{ display: field.value ? '' : 'none' }}
                ref={tooltipRef}
                id="tooltip"
              >
                {tooltipValue}
              </div>

              <div className={style.pointsContainer} id="points-container">
                {[...Array(5)].map((_, i) => (
                  <>
                    <div
                      key={Math.random()}
                      className={style.point}
                      style={{ opacity: i < numPoints ? '1' : '0.5' }}
                    ></div>
                    <div className={style.tooltip2} style={{ opacity: '1' }}>
                      {i + 1}
                    </div>
                  </>
                ))}
              </div>
              {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
            </div>
          );
        }}
      />
    </>
  );
};

export default InputRangeComponent;
