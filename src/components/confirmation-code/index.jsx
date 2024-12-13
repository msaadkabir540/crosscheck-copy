import { useRef, useEffect, useCallback } from 'react';

import { useController } from 'react-hook-form';

import style from './code.module.scss';
import CodeInputField from './code-input-field';

const Code = ({ label, name, className, control }) => {
  const inputsRef = useRef([]);

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const { field } = useController({
    name,

    control,

    defaultValue: '',
  });

  const handleInputChange = useCallback(
    ({ index, event }) => {
      const value = event.target.value;

      const newInputValue = field.value.slice(0, index) + value + field.value.slice(index + 1);

      field.onChange(newInputValue);

      if (value.length === 1 && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    },
    [field],
  );

  const handleInputKeyDown = useCallback(
    ({ index, event }) => {
      if (event.key === 'Backspace' && index > 0 && !event.currentTarget.value) {
        const newInputValue = field.value.slice(0, index - 1) + field.value.slice(index);

        field.onChange(newInputValue);

        inputsRef.current[index - 1]?.focus();
      }
    },
    [field],
  );

  return (
    <div className={`${className && className} ${style.inputContainer}`}>
      {label && <label>{label}</label>}

      <div className={style.inputs}>
        {[...Array(4)].map((_, index) => {
          const inputName = `${name}.${index}`;

          return (
            <CodeInputField
              key={index}
              index={index}
              field={field}
              inputName={inputName}
              handleInputKeyDown={handleInputKeyDown}
              handleInputChange={handleInputChange}
              inputsRef={inputsRef}
            />
          );
        })}
      </div>

      <p className={style.p}>Confirm your account with code from your email.</p>
    </div>
  );
};

export default Code;
