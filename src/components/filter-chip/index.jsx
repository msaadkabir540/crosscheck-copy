import { useCallback, useState } from 'react';

import { Controller } from 'react-hook-form';

import style from './filter-chip.module.scss';
import Icon from '../icon/themed-icon';

const FilterChip = ({
  name,
  onReset,
  searchable = true,
  isDisabled,
  openLeft,
  label,
  applyFilter,
  paramFilter,
  options,
  isMulti,
  control,
  isSingleOption,
  backHidden,
  selectedCount,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSelectAll = useCallback(
    (onChange, value) => {
      const allValues = options?.map((option) => option?.value) || [];
      const allSelected = value?.length === allValues.length;
      onChange(allSelected ? [] : [...allValues]);
    },
    [options],
  );

  const handleOptionClick = useCallback(
    (onChange, value, option) => {
      if (isSingleOption) {
        applyFilter({ label: option?.label, value: option?.value });
        setMenuOpen(false);
        setIsFilterApplied(true);
      }

      if (isMulti) {
        const newSelected = value?.includes(option?.value)
          ? value?.filter((selected) => selected !== option?.value)
          : [...(value || []), option?.value];
        onChange([...newSelected]);
      } else {
        onChange([option?.value]);
        setMenuOpen(false);
      }
    },
    [applyFilter, isMulti, isSingleOption],
  );

  const filteredOptions = options?.filter((option) =>
    option?.label?.toLowerCase()?.includes(searchValue?.toLowerCase()),
  );

  const onFilterClick = useCallback(() => setMenuOpen(true), []);

  const handleCrossAttachment = useCallback(
    (e) => {
      e.stopPropagation();
      onReset();
      setIsFilterApplied(false);
    },
    [onReset],
  );

  const onSearchChange = useCallback((e) => setSearchValue(e.target.value), []);

  const handleClear = useCallback(
    (e) => {
      e.stopPropagation();
      onReset();
      setMenuOpen(false);
      setIsFilterApplied(false);
      setSearchValue('');
    },
    [onReset],
  );

  const handleApply = useCallback(
    (e) => {
      e.stopPropagation();
      applyFilter();
      setMenuOpen(false);
      setIsFilterApplied(true);
      setSearchValue('');
    },
    [applyFilter],
  );

  const handleCloseMenu = useCallback(() => setMenuOpen(false), []);

  const handleRender = useCallback(
    ({ field: { onChange, value } }) => {
      return (
        <>
          {searchable && (
            <div className={style.search}>
              <Icon name={'SearchIcon'} />
              <input type="text" placeholder="Search" value={searchValue} onChange={onSearchChange} />
            </div>
          )}
          {isMulti && filteredOptions?.length > 0 && (
            <RenderSelectAll {...{ handleSelectAll, onChange, value, options }} />
          )}
          {filteredOptions?.length ? (
            filteredOptions?.map((option) => (
              <RenderFilteredOption {...{ handleOptionClick, onChange, value, option }} key={Math.random()} />
            ))
          ) : (
            <div className={`${style.singleOpt} ${style.noOption}`}>No options</div>
          )}
          {!isSingleOption && (
            <div className={style.btns}>
              <span
                onClick={handleClear}
                style={{ color: isDisabled ? 'grey' : '', pointerEvents: isDisabled ? 'none' : '' }}
              >
                Clear
              </span>
              <span onClick={handleApply}>Apply</span>
            </div>
          )}
        </>
      );
    },
    [
      isMulti,
      options,
      isDisabled,
      searchable,
      handleApply,
      handleClear,
      searchValue,
      isSingleOption,
      onSearchChange,
      filteredOptions,
      handleSelectAll,
      handleOptionClick,
    ],
  );

  return (
    <>
      <div
        className={`${style.main} ${backHidden}`}
        style={{
          backgroundColor: (isFilterApplied || paramFilter?.length > 0) && '#E25E3E33',
          borderColor: (isFilterApplied || paramFilter?.length > 0) && 'var(--light-red)',
        }}
        onClick={onFilterClick}
      >
        <h4
          style={{
            color: (isFilterApplied || paramFilter?.length > 0) && 'var(--light-red)',
          }}
        >
          {label} {selectedCount > 0 && `(${selectedCount})`}
        </h4>
        {(isFilterApplied || paramFilter?.length > 0) && (
          <div onClick={handleCrossAttachment}>
            <Icon name={'CrossAttachment'} iconClass={style.orangeIcon} />
          </div>
        )}
        {menuOpen === true && (
          <div className={style.menu} style={{ right: openLeft ? '0px' : '', left: openLeft ? '' : '0px' }}>
            {control && options?.length > 0 ? (
              <Controller name={name} control={control} render={handleRender} />
            ) : (
              <div className={`${style.singleOpt} ${style.noOption}`}>No options</div>
            )}
          </div>
        )}
      </div>
      {menuOpen && <div className={style.backdropDiv} onClick={handleCloseMenu}></div>}
    </>
  );
};

export default FilterChip;

const RenderSelectAll = ({ handleSelectAll, onChange, value, options }) => {
  const onClick = useCallback(() => handleSelectAll(onChange, value), [handleSelectAll, onChange, value]);

  return (
    <div key="selectAll" className={style.singleOpt} onClick={onClick}>
      <input type="checkbox" checked={value?.length === options?.length} className={style.formatOptionLabelInput} />
      <span>Select All</span>
    </div>
  );
};

const RenderFilteredOption = ({ handleOptionClick, onChange, value, option }) => {
  const onClick = useCallback(() => {
    handleOptionClick(onChange, value, option);
  }, [handleOptionClick, onChange, value, option]);

  return (
    <div key={Math.random()} className={style.singleOpt} onClick={onClick}>
      {option?.checkbox && (
        <input type="checkbox" checked={value?.includes(option?.value)} className={style.formatOptionLabelInput} />
      )}
      {option?.image ? (
        <img src={option?.image} alt="" />
      ) : (
        option?.imagAlt && <span className={style.nameIcon}>{option?.imagAlt}</span>
      )}
      <span>{option?.label}</span>
    </div>
  );
};
