import { useState, useEffect, useCallback } from 'react';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import Modal from 'components/modal';
import Checkbox from 'components/checkbox';
import Button from 'components/button';

import style from './columns-modal.module.scss';
import Icon from '../../../components/icon/themed-icon';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const ColumnModal = ({ choseColModal = false, setChoseColModal, columns, setColumns }) => {
  const [checkAllcolumnsShouldBeDisplayed, setAllColumnsShouldBeDisplayed] = useState(false);
  const [columnsCopy, setColumnsCopy] = useState([...columns]);

  useEffect(() => {
    setColumnsCopy([...columns]);
    checkIfAllTheColumnsAreCheckedOrUnChecked(columns);
  }, [columns]);

  const onDragEnd = useCallback(
    (result) => {
      // NOTE: dropped outside the list
      if (!result.destination) return;

      const items = reorder([...columnsCopy], result.source.index, result.destination.index);
      setColumnsCopy([...items]);
    },
    [columnsCopy, setColumnsCopy],
  );

  const checkedAllColumnsHandleEvent = useCallback(
    (event) => {
      let _columns = [];

      if (event?.target?.checked) {
        setAllColumnsShouldBeDisplayed(true);
        _columns = columnsCopy?.map((column) => {
          return { ...column, hidden: false };
        });
      } else {
        setAllColumnsShouldBeDisplayed(false);
        _columns = columnsCopy?.map((column) => {
          return { ...column, hidden: true };
        });
      }

      setColumnsCopy(_columns);
    },
    [columnsCopy, setAllColumnsShouldBeDisplayed],
  );

  const saveColumnChanges = useCallback(() => {
    setChoseColModal(false);
    setColumns([...columnsCopy]);
  }, [columnsCopy, setChoseColModal, setColumns]);

  const selectSingleColumn = useCallback(
    (value, columnKey) => {
      let _columns = [];
      _columns = columnsCopy?.map((x) => {
        return {
          ...x,
          hidden: x?.key === columnKey ? !value : x?.hidden,
        };
      });

      checkIfAllTheColumnsAreCheckedOrUnChecked(_columns);
      setColumnsCopy(_columns);
    },
    [columnsCopy, checkIfAllTheColumnsAreCheckedOrUnChecked, setColumnsCopy],
  );

  const checkIfAllTheColumnsAreCheckedOrUnChecked = useCallback(
    (columns) => {
      const checkedAllColumns = columns?.every((column) => column?.hidden === false);
      if (checkedAllColumns) setAllColumnsShouldBeDisplayed(true);
      else setAllColumnsShouldBeDisplayed(false);
    },
    [setAllColumnsShouldBeDisplayed],
  );

  const handleCloseChooseColModal = useCallback(() => {
    setChoseColModal(false);
  }, [setChoseColModal]);

  const renderRow = useCallback(
    (provided, ele) => <DraggableCheckboxRow ele={ele} provided={provided} selectSingleColumn={selectSingleColumn} />,
    [selectSingleColumn],
  );

  return (
    <div>
      <Modal open={choseColModal} handleClose={handleCloseChooseColModal} className={style.mainDiv}>
        <div className={style.crossImg}>
          <span className={style.modalTitle}>Change Columns</span>

          <div onClick={handleCloseChooseColModal} className={style.hover}>
            <Icon name={'CrossIcon'} />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        <div className={style.selectAllDiv}>
          <Checkbox
            type="checkbox"
            id="selectAll"
            label="Select All"
            containerClass={style.checkboxClass}
            handleChange={checkedAllColumnsHandleEvent}
            checked={checkAllcolumnsShouldBeDisplayed}
          />
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable-id">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className={style.upperDiv}>
                {columnsCopy?.map((ele, index) => {
                  if (ele?.key !== 'actions') {
                    return (
                      <Draggable key={ele.key} draggableId={ele.key} index={index}>
                        {renderRow}
                      </Draggable>
                    );
                  }
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className={style.mainBtnDiv}>
          <Button text={'Confirm Changes'} type="button" handleClick={saveColumnChanges} />
        </div>
      </Modal>
    </div>
  );
};

export default ColumnModal;

const DraggableCheckboxRow = ({ ele, provided, selectSingleColumn }) => {
  const handleSelectColumn = useCallback(
    (event) => {
      selectSingleColumn(event?.target?.checked, ele?.key);
    },
    [selectSingleColumn],
  );

  return (
    <div key={ele.key} ref={provided.innerRef} {...provided.draggableProps} className={style.rowDiv}>
      <Checkbox
        type="checkbox"
        id={ele.key}
        label={ele.name}
        checked={!ele?.hidden}
        handleChange={handleSelectColumn}
      />
      <div {...provided.dragHandleProps}>
        <Icon name={'DragIcon'} />
      </div>
    </div>
  );
};
