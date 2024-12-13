import { useCallback } from 'react';

const CodeInputField = ({ index, field, inputName, handleInputKeyDown, handleInputChange, inputsRef }) => {
  const handleonKeyDownAction = useCallback(
    (event) => {
      handleInputKeyDown({ index, event });
    },
    [handleInputKeyDown, index],
  );

  const handleInputChangeAction = useCallback(
    (event) => {
      handleInputChange({ index, event, inputName });
    },
    [handleInputChange, inputName, index],
  );

  const handleInputRef = useCallback(
    (input) => {
      inputsRef.current[index] = input;
    },
    [index, inputsRef],
  );

  return (
    <input
      key={index}
      type="number"
      maxLength={1}
      value={field.value?.[index] || ''}
      name={inputName}
      ref={handleInputRef}
      onKeyDown={handleonKeyDownAction}
      onChange={handleInputChangeAction}
    />
  );
};

export default CodeInputField;
