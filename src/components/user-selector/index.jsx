import { useCallback, useState } from 'react';

import style from './user-select.module.scss';
import ThemedIcon from '../icon/themed-icon';

const UserSelector = ({ options = [], setSelectedUser }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const toggleView = useCallback(() => {
    setIsViewOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (option) => {
      setSelectedOption(option);
      setSelectedUser(option);
      setIsViewOpen(false);
    },
    [setSelectedUser],
  );

  const handleChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  const handleClear = useCallback(
    (e) => {
      e.stopPropagation();
      setSelectedOption(null);
      setSelectedUser(null);
    },
    [setSelectedUser],
  );

  const filteredOptions = options?.filter((option) =>
    option?.label?.toLowerCase()?.includes(searchValue?.toLowerCase()),
  );

  return (
    <div className={style.selectBox}>
      <div className={style.selectedOption} onClick={toggleView}>
        {selectedOption ? selectedOption.label : 'View As'}
        {!selectedOption && (
          <div style={{ rotate: isViewOpen ? '0deg' : '180deg' }} className={style.arrowDiv}>
            <ThemedIcon name={'ArrowUp'} iconClass={style.arrowIcon} />
          </div>
        )}
        {selectedOption && (
          <div onClick={handleClear}>
            <ThemedIcon name={'CrossIcon'} iconClass={style.crossIcon} />
          </div>
        )}
      </div>
      {isViewOpen && (
        <div className={style.optionsContainer}>
          <div className={style.search}>
            <ThemedIcon name={'SearchIcon'} iconClass={style.searchIcon} />
            <input type="text" placeholder="Search" value={searchValue} onChange={handleChange} />
          </div>
          {filteredOptions?.length ? (
            filteredOptions?.map((option) => (
              // eslint-disable-next-line react/jsx-no-bind
              <div key={option.value} className={style.option} onClick={() => handleSelect(option)}>
                {option.image ? (
                  <img height={24} width={24} src={option.image} alt={option.label} className={style.optionImage} />
                ) : (
                  <span className={style.optionImage}>{option.imagAlt}</span>
                )}
                <span className={style.optionLabel}>{`${option.label} (${option.role})`}</span>
              </div>
            ))
          ) : (
            <div className={`${style.singleOpt} ${style.noOption}`}>No options</div>
          )}
        </div>
      )}
      {isViewOpen && <div onClick={toggleView} className={style.BackDrop} />}
    </div>
  );
};

export default UserSelector;
