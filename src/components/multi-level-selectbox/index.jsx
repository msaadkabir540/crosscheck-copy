/* eslint-disable react/jsx-no-bind */
import { useCallback, useEffect, useState, useRef } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import style from './multi-select.module.scss';

const MultiLevelSelect = ({ control, setValue, name, options = [], label, placeholder }) => {
  const { watch } = useFormContext();
  const [expandedOptions, setExpandedOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const checkboxRefs = useRef({});

  const isHalfSelected = useCallback(
    (option) => {
      if (!option || !option.children) return false;
      const childrenLabels = option.children.map((child) => child.label);
      const selectedChildren = selectedOptions.filter((selected) => childrenLabels.includes(selected));

      return selectedChildren.length > 0 && selectedChildren.length < option.children.length;
    },
    [selectedOptions],
  );

  const isFullySelected = useCallback(
    (option) => {
      if (!option || !option.children) return false;
      const childrenLabels = option.children.map((child) => child.label);
      const selectedChildren = selectedOptions.filter((selected) => childrenLabels.includes(selected));

      return selectedChildren.length === option.children.length;
    },
    [selectedOptions],
  );

  useEffect(() => {
    Object.keys(checkboxRefs.current).forEach((key) => {
      const checkbox = checkboxRefs.current[key];
      const option = options.find((opt) => opt.label === key);

      if (checkbox && option) {
        const isIndeterminate = isHalfSelected(option);
        checkbox.indeterminate = isIndeterminate;
        checkbox.checked = isFullySelected(option);
      }
    });
  }, [selectedOptions, expandedOptions, options, isHalfSelected, isFullySelected]);

  const handleExpand = (optionLabel) => {
    setExpandedOptions((prev) =>
      prev.includes(optionLabel) ? prev.filter((item) => item !== optionLabel) : [...prev, optionLabel],
    );
  };

  const handleSelect = (option, isParent = false) => {
    const { label = '' } = option;
    let newSelectedOptions = [...selectedOptions];

    const updateSelection = (optionLabel, shouldSelect) => {
      if (shouldSelect) {
        if (!newSelectedOptions.includes(optionLabel)) {
          newSelectedOptions.push(optionLabel);
        }
      } else {
        newSelectedOptions = newSelectedOptions.filter((item) => item !== optionLabel);
      }
    };

    const processOption = (option, shouldSelect) => {
      updateSelection(option.label, shouldSelect);

      if (option.children) {
        option.children.forEach((child) => processOption(child, shouldSelect));
      }
    };

    const isOptionSelected = selectedOptions.includes(label);
    const shouldSelect = !isOptionSelected;

    if (isParent) {
      processOption(option, shouldSelect);
    } else {
      updateSelection(label, shouldSelect);
    }

    setSelectedOptions(newSelectedOptions);
    setValue(name, newSelectedOptions);
  };

  const renderOptions = (options, level = 0) => {
    return options.map((option) => {
      if (!option) return null;

      const isChecked = selectedOptions.includes(option.label) || isFullySelected(option);

      return (
        <div key={option.label} className={style.option}>
          <div className={style.mainOption} onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              ref={(el) => (checkboxRefs.current[option.label] = el)}
              checked={isChecked}
              onChange={() => handleSelect(option, true)}
            />
            <span onClick={() => handleExpand(option.label)}>{option.label}</span>
          </div>
          {expandedOptions.includes(option.label) && option.children && (
            <div className={style.children}>{renderOptions(option.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleToggleDropdown = useCallback(
    (e) => {
      e.stopPropagation();
      toggleDropdown();
    },
    [toggleDropdown],
  );

  const handleOptionDivClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const getSelectedChildCount = useCallback(() => {
    const selectedChildLabels = options
      .flatMap((option) => (option.children ? option.children.map((child) => child.label) : []))
      .filter((label) => selectedOptions.includes(label));

    return selectedChildLabels.length;
  }, [options, selectedOptions]);

  const formValues = watch(name);

  useEffect(() => {
    if (formValues) {
      setSelectedOptions(formValues);
    }
  }, [formValues]);

  useEffect(() => {
    if (control._formValues[name]) {
      setSelectedOptions(control._formValues[name]);
    }
  }, [control._formValues, name]);

  return (
    <div className={style.multiLevelSelect}>
      <label className={style.lbl}>{label}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={() => (
          <div className={style.selectBox} onClick={handleToggleDropdown}>
            <div className={style.displayValueOnly}>
              {getSelectedChildCount() > 0 ? (
                `${getSelectedChildCount()} selected`
              ) : (
                <p className={style.placeHolder}>{placeholder}</p>
              )}
            </div>
            {isDropdownOpen && (
              <div className={style.selectDiv}>
                <div className={style.optionDiv} onClick={handleOptionDivClick}>
                  {renderOptions(options)}
                </div>
              </div>
            )}
          </div>
        )}
      />
      {isDropdownOpen && <div className={style.backdropDiv} onClick={toggleDropdown} />}
    </div>
  );
};

export default MultiLevelSelect;
