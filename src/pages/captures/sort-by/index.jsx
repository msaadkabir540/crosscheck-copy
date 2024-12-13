import { useState, useCallback } from 'react';

import { Controller } from 'react-hook-form';

import Icon from 'components/icon/themed-icon';

import style from './sort-filter.module.scss';

const OptionItem = ({ option, selectedOption, sortBy, handleOptionClick }) => {
  const isSelected = selectedOption === option;

  const handleOptionClickAction = useCallback(() => {
    handleOptionClick(option);
  }, [handleOptionClick, option]);

  const handleAscClick = useCallback(() => {
    handleOptionClick('asc');
  }, [handleOptionClick]);

  const handleDescClick = useCallback(() => {
    handleOptionClick('desc');
  }, [handleOptionClick]);

  return (
    <div className={style.singleOpt} onClick={handleOptionClickAction}>
      <span style={{ color: isSelected ? 'var(--font-c)' : '', fontWeight: isSelected ? '600' : '' }}>
        {option?.label}
      </span>
      {isSelected && (
        <div>
          <div
            style={{
              opacity: sortBy === 'asc' ? 1 : 0.5,
            }}
            className={style.icon_container_style}
            onClick={handleAscClick}
          >
            <Icon name={'ArrowUp'} iconClass={style.yourIconClass} height={'13px'} width={'13px'} />
          </div>
          <div
            style={{
              opacity: sortBy === 'desc' ? 1 : 0.5,
              rotate: sortBy && '180deg',
            }}
            className={style.icon_container_style}
            onClick={handleDescClick}
          >
            <Icon name={'ArrowUp'} iconClass={style.yourIconClass} height={'13px'} width={'13px'} />
          </div>
        </div>
      )}
    </div>
  );
};

const SortByFilter = ({ name, applyFilter, options, control }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [sortBy, setSortBy] = useState('desc');

  const handleOptionClick = useCallback(
    (option) => {
      if (option === 'asc' || option === 'desc') {
        setSortBy(option);
        setSelectedOption(null);
        setMenuOpen(false);
        setSortBy(option);
        applyFilter({ sortOn: selectedOption?.value || 'createdAt', sortBy: option });
      } else {
        setSelectedOption(option);
        applyFilter({ sortOn: option.value, sortBy });
        setMenuOpen(false);
      }
    },
    [applyFilter, selectedOption?.value, sortBy],
  );

  const hadnleCloseMenu = useCallback(() => {
    setMenuOpen(false);
  }, [setMenuOpen]);

  const hadnleOpenMenu = useCallback(() => {
    setMenuOpen(true);
  }, [setMenuOpen]);

  return (
    <>
      <div className={style.main} onClick={hadnleOpenMenu}>
        <div className={style.name_space}>
          <h4>{selectedOption ? selectedOption.label : options[0]?.label}</h4>
          <Icon name={'ArrowDownIcon'} iconClass={style.orangeIcon} />
        </div>
        {menuOpen && (
          <div className={style.menu}>
            {control && options?.length > 0 ? (
              <Controller
                name={name}
                control={control}
                // eslint-disable-next-line react/jsx-no-bind
                render={() => (
                  <>
                    {options?.length ? (
                      options?.map((option) => (
                        <OptionItem
                          key={option?.label}
                          option={option}
                          selectedOption={selectedOption}
                          sortBy={sortBy}
                          handleOptionClick={handleOptionClick}
                        />
                      ))
                    ) : (
                      <div className={`${style.singleOpt} ${style.noOption}`}>No options</div>
                    )}
                  </>
                )}
              />
            ) : (
              <div className={`${style.singleOpt} ${style.noOption}`}>No options</div>
            )}
          </div>
        )}
      </div>
      {menuOpen && <div className={style.backdropDiv} onClick={hadnleCloseMenu}></div>}
    </>
  );
};

export default SortByFilter;
