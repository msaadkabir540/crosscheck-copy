import { useCallback, useMemo } from 'react';

import Icon from '../icon/themed-icon';
import style from './generic-table.module.scss';

const TableColumn = ({
  i,
  name,
  filters,
  classes,
  columnKey,
  sortModal,
  setSortModal,
  onClickHeader,
  nonSortingColumnKeys = [],
}) => {
  const ascendingActive = useMemo(() => {
    return filters?.sortBy === columnKey && filters?.sort === 'asc';
  }, [filters, columnKey]);

  const descendingActive = useMemo(() => {
    return filters?.sortBy === columnKey && filters?.sort === 'desc';
  }, [filters, columnKey]);

  const handleFilterClick = useCallback(() => {
    setSortModal(sortModal == i ? null : i);
  }, [i, sortModal, setSortModal]);

  const onAscending = useCallback(() => {
    onClickHeader({ sortBy: columnKey, sort: 'asc' });
    setSortModal(null);
  }, [setSortModal, columnKey, onClickHeader]);

  const onDescending = useCallback(() => {
    onClickHeader({ sortBy: columnKey, sort: 'desc' });
    setSortModal(null);
  }, [setSortModal, columnKey, onClickHeader]);

  return (
    <>
      <span className={`${classes?.th} ${style.columnSpan}`} style={{ cursor: columnKey !== 'actions' && 'pointer' }}>
        {name}

        {![...nonSortingColumnKeys, 'actions']?.includes(columnKey) &&
          (filters?.sortBy === columnKey ? (
            filters?.sort ? (
              <div onClick={handleFilterClick} id="generic-table-active-sort" className={style.filterIcon}>
                <Icon name={'ActiveSorting'} />
              </div>
            ) : (
              <></>
            )
          ) : (
            <div className={style.sortingIcon} id="generic-table-inactive-sort" onClick={handleFilterClick}>
              <Icon name={'InactiveSorting'} />
            </div>
          ))}
        {sortModal == i && (
          <div className={style.sortModal}>
            <div className={style.sortOption} onClick={onAscending}>
              <div
                id="generic-table-ascending"
                className={ascendingActive ? style.activeImg : style.ascendingClass}
                style={{ transform: ascendingActive && 'rotate(180deg)' }}
              >
                <Icon name={ascendingActive ? 'ActiveDescending' : 'Ascending'} />
              </div>

              <p style={{ color: ascendingActive && '#e25e3e' }}>Sort Ascending</p>
            </div>
            <div className={style.sortOption} onClick={onDescending} id="generic-table-descending">
              <div className={descendingActive ? style.activeImg : style.ascendingClass}>
                <Icon name={descendingActive ? 'ActiveDescending' : 'Descending'} />
              </div>
              <p style={{ color: descendingActive && '#e25e3e' }} className={style.sortOption}>
                Sort Descending
              </p>
            </div>
          </div>
        )}
        {sortModal === i && <div className={style.sortBackdrop} onClick={handleFilterClick}></div>}
      </span>
    </>
  );
};

export default TableColumn;
