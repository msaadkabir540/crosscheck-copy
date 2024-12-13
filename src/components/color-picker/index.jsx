import { useState, useEffect, useRef } from 'react';

import { BlockPicker } from 'react-color';
import { Controller } from 'react-hook-form';

import style from './style.module.scss';

const Index = ({ control, name, label, rules, defaultValue, className }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

  // NOTE: Add a click event listener to the document to handle clicks outside the color picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setDisplayColorPicker(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    // NOTE: Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={`${style.main} ${className}`}>
        {label && <label className={style.label}>{label}</label>}

        <Controller
          control={control}
          rules={rules}
          name={name}
          defaultValue={defaultValue}
          render={({ field: { onChange, value } }) => {
            return (
              <div style={{ position: 'relative' }} ref={colorPickerRef}>
                <div
                  className={style.colorPickerWrapper}
                  onClick={() => {
                    setDisplayColorPicker(true);
                  }}
                >
                  <div
                    className={style.colorPickedBox}
                    style={{
                      backgroundColor: value,
                    }}
                  />
                  <div className={style.colorPickedText}>{value?.toUpperCase()}</div>
                </div>
                {displayColorPicker ? (
                  <div className={style.popover}>
                    <BlockPicker
                      color={value} // NOTE: Pass the currently selected color as the initial color
                      onChangeComplete={(selectedColor) => {
                        onChange(selectedColor.hex);
                      }}
                      colors={[
                        '#d9e3f0',
                        '#f47373',
                        '#697689',
                        '#37d67a',
                        '#2ccce4',

                        '#555555',
                        '#dce775',
                        '#ff8a65',
                        '#ba68c8',

                        '#0055A5',
                      ]}
                    />
                  </div>
                ) : null}
              </div>
            );
          }}
        />
      </div>
    </>
  );
};

export default Index;
