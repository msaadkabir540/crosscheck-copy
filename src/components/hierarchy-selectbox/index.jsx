import { memo, useRef, useMemo, useEffect, useCallback, useState } from 'react';

import PropTypes from 'prop-types';
import _ from 'lodash';

import arrow from 'assets/arrow-down.svg';

import style from './hierarchy-selectbox.module.scss';
import ThemedIcon from '../icon/themed-icon';

const HierarchicalDropdown = ({
  options,
  label,
  error,
  errorMsg,
  selectedValue,
  setSelectedValue,
  defaultValue = null,
  setValue,
  name,
  setMembers,
  id,
  disabled = false,
  placeholder = '',
}) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const bookMarkRef = useRef(null);

  const inputRef = useRef(null);

  function findPath(data, targetId, path = []) {
    for (const item of data) {
      const newPath = [...path, item.value];

      if (item.child) {
        const result = findPath(item.child, targetId, newPath);
        if (result) return result;
      }

      if (item.key === targetId) {
        return newPath.join('➡️');
      }
    }

    return null;
  }

  function findParentId(data, targetId, path = []) {
    for (const item of data) {
      const newPath = [...path, item.key];

      if (item.child) {
        const result = findPath(item.child, targetId, newPath);

        if (result) return result;
      }

      if (item.key === targetId) {
        return newPath.join(', ');
      }
    }

    return null;
  }

  const result = findPath(options, selectedValue);
  let teamId = findParentId(options, selectedValue);
  teamId = teamId ? teamId?.split('➡️')[0] : null;
  setValue('location', { teamId, listId: selectedValue });

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;

    return filterOptionsBySearch(options, searchQuery);
  }, [options, searchQuery]);

  const onChangeSearch = useCallback((e) => {
    setSearchQuery(e?.target?.value);
  }, []);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue, setSelectedValue]);

  const getParentKeys = useCallback(
    (data, targetKey, parentKeys = []) => {
      for (const item of data) {
        if (item.key === targetKey) {
          parentKeys.push(item.key);

          if (item.parentKey) {
            getParentKeys(data, item.parentKey, parentKeys);
          }

          break;
        } else if (item.child && item.child.length > 0) {
          parentKeys.push(item.key);

          getParentKeys(item.child, targetKey, parentKeys);

          if (parentKeys.includes(targetKey)) {
            break;
          } else {
            parentKeys.pop();
          }
        }
      }

      return parentKeys;
    },

    [],
  );

  const parentKeys = useMemo(() => {
    return getParentKeys(options, selectedValue);
  }, [selectedValue, options, getParentKeys]);

  const onChangeSelectedValue = useCallback(
    (selectedDropdownValue) => {
      setSelectedValue(selectedDropdownValue);

      setValue(name, selectedDropdownValue, { shouldDirty: true });
    },
    [setSelectedValue, setValue, name],
  );

  useEffect(() => {
    if (menuIsOpen && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [menuIsOpen]);

  const handleToggleMenu = useCallback(() => {
    setMenuIsOpen((prev) => !prev);
  }, []);

  const handleImageClickAction = useCallback(() => {
    onChangeSelectedValue(null);
    setMembers([]);
    setValue('clickUpAssignee', []);
  }, [onChangeSelectedValue, setValue, setMembers]);

  return (
    <div ref={bookMarkRef}>
      {label ? <div className={style.lbl}>{label}</div> : error ? error : <></>}

      <div className={style.treeSelect}>
        <div
          className={`${style.treeSelectInput} ${disabled && style.isDisabled} `}
          onClick={handleToggleMenu}
          style={{ borderColor: errorMsg && '#FF5455' }}
        >
          <div className={`${style.input} ${!selectedValue && placeholder && style.placeholder} `}>
            <input
              type={'text'}
              value={!_.isNull(selectedValue) ? result : !_.isNull(searchQuery) ? searchQuery : ''}
              placeholder={placeholder || ''}
              onChange={onChangeSearch}
              ref={inputRef}
              data-cy={id}
            />
          </div>

          <div className={style.operators}>
            {selectedValue && (
              <div onClick={handleImageClickAction} className={style.crossDiv}>
                <ThemedIcon name={'CrossIconSmall'} />
              </div>
            )}
            {!selectedValue && (
              <img
                src={arrow}
                alt="arrow-icon"
                width={'13px'}
                height={'15px'}
                className={style.arrow}
                style={{ rotate: menuIsOpen ? '180deg' : '' }}
              />
            )}
          </div>
        </div>

        {menuIsOpen && (
          <div className={style.treeSelectList}>
            {filteredOptions?.map((option) => {
              return (
                <DropdownOption
                  key={id}
                  option={{ ...option, child: option?.child || [] }}
                  level={0}
                  selectedValue={selectedValue}
                  parentKeys={parentKeys}
                  setSelectedValue={onChangeSelectedValue}
                  setMenuIsOpen={setMenuIsOpen}
                  searchQuery={searchQuery}
                />
              );
            })}
          </div>
        )}
      </div>
      {errorMsg && <span className={style.errorMsg}>{errorMsg}</span>}
    </div>
  );
};

const DropdownOption = ({
  option,

  level,

  parentKeys,

  setSelectedValue,

  setMenuIsOpen,

  searchQuery,
}) => {
  const indentStyle = {
    paddingLeft: `${level * 20}px`,
  };

  const [open, setOpen] = useState(false);

  const handleSingleMenuSoanClick = useCallback(() => {
    if (option?.child?.length == 0 && !option.child?.child) {
      setMenuIsOpen(false);

      setSelectedValue(option?.key);
    }
  }, [setSelectedValue, setMenuIsOpen, option.child?.child, option.child?.length, option?.key]);

  useEffect(() => {
    if (parentKeys?.includes(option.key) && option?.child?.length > 0) {
      setOpen(true);
    }
  }, [parentKeys, option?.child?.length, option?.key]);

  const isOptionMatchingSearch = useMemo(() => {
    return option?.value?.toLowerCase()?.includes(searchQuery?.toLowerCase());
  }, [option.value, searchQuery]);

  useEffect(() => {
    if (searchQuery && option?.child?.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isOptionMatchingSearch, option?.child?.length, searchQuery]);

  const hanldeOpenToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <div className={style.option} style={indentStyle}>
      <div onClick={hanldeOpenToggle}>
        <span
          data-cy={option.key}
          className={`${style.singleItem} 
          ${parentKeys?.includes(option.key) && option?.child?.length == 0 ? style.singleItemHasChild : style.singleItemHasNoChild}
          `}
          onClick={handleSingleMenuSoanClick}
        >
          {option?.child?.length > 0 ? (
            <img src={arrow} alt="arrow" width={'10px'} height={'10px'} style={{ rotate: open ? '' : '-90deg' }} />
          ) : (
            <div className={style.marginClass}></div>
          )}

          {isOptionMatchingSearch && searchQuery ? <strong>{option.value}</strong> : option.value}
        </span>
      </div>

      {open &&
        option?.child?.map((childOption) => (
          <DropdownOption
            key={childOption.key}
            option={{ ...childOption, child: childOption?.child || [] }}
            level={level + 1}
            parentKeys={parentKeys}
            setSelectedValue={setSelectedValue}
            setMenuIsOpen={setMenuIsOpen}
            searchQuery={searchQuery}
          />
        ))}
    </div>
  );
};

const filterOptionsBySearch = (options, searchQuery) => {
  return options?.reduce((filtered, option) => {
    const matchingChildOptions = filterOptionsBySearch(option.child, searchQuery);

    if (option.value.toLowerCase().includes(searchQuery.toLowerCase()) || matchingChildOptions?.length > 0) {
      filtered.push({
        ...option,

        child: matchingChildOptions,
      });
    }

    return filtered;
  }, []);
};

const listType = PropTypes.shape({
  key: PropTypes.string.isRequired,

  value: PropTypes.string.isRequired,

  type: PropTypes.string.isRequired,

  sortOrder: PropTypes.number.isRequired || PropTypes.string.isRequired,
});

const areaPropType = PropTypes.shape({
  ...listType.prototype,

  child: PropTypes.arrayOf(
    PropTypes.shape({
      ...listType.prototype,

      child: PropTypes.array,
    }),
  ),
});

areaPropType.propTypes = {
  child: PropTypes.arrayOf(
    PropTypes.shape({
      ...areaPropType.propTypes,
    }),
  ),
};

HierarchicalDropdown.protoTypes = {
  options: PropTypes.arrayOf(areaPropType).isRequired,
};

export default memo(HierarchicalDropdown);
