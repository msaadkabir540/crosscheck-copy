import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

import EditAddTable from 'pages/user-management/edit-add';

import TableDraggableComponent from 'components/dragable/table-draggable';

import noFound from 'assets/no-found.svg';

import TableColumn from './table-column';
import TableCell from './table-cell';
import style from './generic-table.module.scss';

const GenericTable = (
  {
    columns = [],
    filters,
    dataSource,
    loading = false,
    height,
    width,
    classes,
    onDragUpdate,
    draggable,
    optionMenu,
    separateDraggingElement,
    onClickHeader = () => {},
    isEditMode = false,
    editUserId,
    overflowX = 'auto',
    cancelEvent,
    handleUpdatedUser,
    selectedItem,
    nonSortingColumnKeys,
    setRightClickedRecord = () => {},
    id,
    menuData,
    noHeader,
    setMenu,
    menu,
  },
  ref,
) => {
  const containerRef = ref;

  const [rows, setRows] = useState([]);
  const genericTableRef = useRef();
  const addWidth = useRef(null);
  const [openRow, setOpenRow] = useState(null);
  const [sortModal, setSortModal] = useState(null);

  const toggleRowOpen = (index) => {
    setOpenRow((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    setRows([...dataSource]);
  }, [dataSource]);

  const tableDataStyles = useMemo(() => {
    return {
      height: height,
      overflowY: 'auto',
      overflowX,
      width,
    };
  }, [height, overflowX, width]);

  const handlerendeContent = useCallback(
    (row, index, provided) => {
      return (
        <>
          {columns.map(
            (col, index2) =>
              !col.hidden && (
                <TableCellWrapper
                  {...{
                    row,
                    col,
                    index,
                    index2,
                    openRow,
                    noHeader,
                    provided,
                    optionMenu,
                    toggleRowOpen,
                    setRightClickedRecord,
                  }}
                  key={col.id}
                />
              ),
          )}

          {isEditMode && editUserId === row._id && (
            <EditAddTable
              cancelEvent={cancelEvent}
              width={addWidth.current?.offsetWidth}
              editUserId={editUserId}
              handleUpdatedUser={handleUpdatedUser}
              actionType="edit"
            />
          )}
        </>
      );
    },
    [
      columns,
      openRow,
      noHeader,
      editUserId,
      isEditMode,
      optionMenu,
      cancelEvent,
      handleUpdatedUser,
      setRightClickedRecord,
    ],
  );

  return (
    <div style={tableDataStyles} data-cy="table-data" ref={containerRef} id={id}>
      <div className={style.innerTable}>
        <div
          style={{
            width: `${genericTableRef?.current?.offsetWidth}px`,
          }}
          className={loading ? classes?.tableOnLoading : classes?.tableOffLoading}
        ></div>
        {rows.length ? (
          <table ref={genericTableRef} className={`${classes?.table} ${style.tableClass}`}>
            <thead className={classes?.thead}>
              <tr ref={addWidth}>
                {columns?.map(({ name, key, hidden, customHeaderClass, widthAndHeight }, i) => {
                  return (
                    !hidden && (
                      <th
                        style={{ width: widthAndHeight?.width }}
                        className={`${classes?.th} ${customHeaderClass} ${style.headerClass} `}
                      >
                        <TableColumn
                          {...{
                            i,
                            name,
                            hidden,
                            filters,
                            classes,
                            sortModal,
                            setSortModal,
                            onClickHeader,
                            widthAndHeight,
                            columnKey: key,
                            customHeaderClass,
                            nonSortingColumnKeys,
                          }}
                        />
                      </th>
                    )
                  );
                })}
              </tr>
            </thead>
            {rows.length ? (
              <TableDraggableComponent
                menuData={menuData}
                menu={menu}
                setMenu={setMenu}
                listElements={rows}
                isDragDisabled={!draggable}
                separateDraggingElement={separateDraggingElement}
                droppableClassName={'text-capitalize'}
                draggableClassName={`${classes?.tableBody} ${style.rowHoverClass}`}
                selectedItemClass={`${style.selectedItemClass}`}
                selectedItem={selectedItem}
                draggableDraggingStyle={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '25px',
                }}
                onDragEnd={onDragUpdate}
                renderContent={handlerendeContent}
              />
            ) : (
              'renderNoDataFound'
            )}
          </table>
        ) : (
          <div className={style.notFoundDiv}>
            <img src={noFound} alt="" />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(React.forwardRef(GenericTable));

const TableCellWrapper = ({
  row,
  col,
  index,
  index2,
  openRow,
  noHeader,
  provided,
  optionMenu,
  toggleRowOpen,
  setRightClickedRecord,
}) => {
  const onToggleRowOpen = useCallback(() => toggleRowOpen(index), [toggleRowOpen, index]);

  return (
    <TableCell
      noHeader={noHeader}
      setRightClickedRecord={setRightClickedRecord}
      isOpen={openRow === index}
      toggleRowOpen={onToggleRowOpen}
      index={index2}
      id={row._id}
      key={col.id}
      column={col}
      row={{ ...row, index }}
      isLastCell={col?.lastCell}
      provided={provided}
      optionMenu={optionMenu}
    />
  );
};
