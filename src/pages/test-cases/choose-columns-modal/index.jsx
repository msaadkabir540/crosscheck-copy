import { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
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

  const onDragEnd = (result) => {
    // NOTE: dropped outside the list
    if (!result.destination) return;

    const items = reorder([...columnsCopy], result.source.index, result.destination.index);
    setColumnsCopy([...items]);
  };

  const checkedAllColumnsHandleEvent = (event) => {
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
  };

  const saveColumnChanges = () => {
    setChoseColModal(false);
    setColumns([...columnsCopy]);
  };

  const selectSingleColumn = (value, columnKey) => {
    let _columns = [];
    _columns = columnsCopy?.map((x) => {
      return {
        ...x,
        hidden: x?.key === columnKey ? !value : x?.hidden,
      };
    });

    checkIfAllTheColumnsAreCheckedOrUnChecked(_columns);
    setColumnsCopy(_columns);
  };

  const checkIfAllTheColumnsAreCheckedOrUnChecked = (columns) => {
    const checkedAllColumns = columns?.every((column) => column?.hidden === false);
    if (checkedAllColumns) setAllColumnsShouldBeDisplayed(true);
    else setAllColumnsShouldBeDisplayed(false);
  };

  return (
    <div>
      <Modal open={choseColModal} handleClose={() => setChoseColModal(false)} className={style.mainDiv}>
        <div className={style.crossImg}>
          <span className={style.modalTitle}>Change Columns</span>
          <div onClick={() => setChoseColModal(false)} className={style.hover}>
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
                        {(provided) => (
                          <div
                            key={ele.key}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={style.rowDiv}
                          >
                            <Checkbox
                              type="checkbox"
                              id={ele.key}
                              label={ele.name}
                              checked={!ele?.hidden}
                              handleChange={(event) => selectSingleColumn(event?.target?.checked, ele?.key)}
                            />
                            <div {...provided.dragHandleProps}>
                              <Icon name={'DragIcon'} />
                            </div>
                          </div>
                        )}
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

ColumnModal.propTypes = {
  choseColModal: PropTypes.bool,
  setChoseColModal: PropTypes.func.isRequired,
  columns: PropTypes.any.isRequired,
  setColumns: PropTypes.func.isRequired,
};

export default ColumnModal;
