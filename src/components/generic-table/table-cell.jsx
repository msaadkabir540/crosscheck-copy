import { memo, useEffect, useState, useRef, useCallback } from 'react';

import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';

import ClickUpMenu from 'components/click-up-menu';

import style from './generic-table.module.scss';

const TableCell = ({
  id,
  column,
  row,
  index,
  provided,
  isOpen = true,
  toggleRowOpen,
  optionMenu,
  noHeader,
  isLastCell,
  setRightClickedRecord = () => {},
}) => {
  const location = useLocation();
  const activeValue = new URLSearchParams(location.search).get('active');
  const [menuOpen, setMenuOpen] = useState(false);
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [openRow, setOpenRow] = useState({});
  const menuRef = useRef(null);

  const cardHeight =
    location.pathname === '/test-cases'
      ? 300
      : location.pathname === '/qa-testing'
        ? 400
        : location.pathname === '/test-run'
          ? 200
          : noHeader && activeValue === '2'
            ? 400
            : noHeader && activeValue === '3'
              ? 200
              : 300;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      setMenuOpen(true);
      setOpenRow(row);
      setRightClickedRecord(row);
      setPoints({
        x: e.pageX,
        y: e.pageY,
      });
    },
    [row, setRightClickedRecord],
  );

  const handleCellClick = useCallback(
    (e) => {
      if (isLastCell) {
        handleContextMenu(e);
      } else {
        toggleRowOpen();
      }
    },
    [handleContextMenu, isLastCell, toggleRowOpen],
  );

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (column.render) {
    return (
      <>
        <td
          className={`${isOpen ? style.tableRowClicked : style.tableRow} ${style.genericTd}`}
          onClick={handleCellClick}
          onContextMenu={handleContextMenu}
        >
          {column?.render({
            profilePicture: row?.profilePicture,
            value: row[column.key],
            row,
            ...(provided && { provided }),
            id,
            index,
          })}
          {menuOpen &&
            optionMenu &&
            ReactDOM.createPortal(
              <div
                ref={menuRef}
                onClick={stopPropagation}
                className={style.rightClickMenu}
                style={{
                  top: `${window.innerHeight - points.y < cardHeight ? window.innerHeight - cardHeight : points.y}px`,
                  left: `${window.innerWidth - points.x < 266 ? window.innerWidth - 276 : points.x}px`,
                }}
              >
                <ClickUpMenu
                  noHeader={noHeader}
                  setRightClickedRecord={setRightClickedRecord}
                  rightClickedRow={openRow}
                  atMostRight={window.innerWidth - points.x < 266}
                  setOpenRow={setOpenRow}
                  setMenuOpen={setMenuOpen}
                  menuData={optionMenu ?? []}
                />
              </div>,
              document.body,
            )}
        </td>
      </>
    );
  } else {
    return <td>{row[column.key]}</td>;
  }
};

export default memo(TableCell);
