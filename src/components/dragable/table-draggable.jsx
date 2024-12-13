import { useState, useEffect, useCallback } from 'react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import style from './style.module.scss';

export const DraggableComponent = ({
  listElements = [],
  isDragDisabled = true,
  droppableStyles = {},
  draggableStyles = {},
  droppableClassName = '',
  selectedItemClass = '',
  draggableClassName = '',
  droppableDraggingStyle = {},
  draggableDraggingStyle = {},
  separateDraggingElement = false,
  renderContent,
  onDragUpdate,
  onDragStart,
  selectedItem,
  onDragEnd: _onDragEnd,
  onBeforeCapture,
  onBeforeDragStart,
}) => {
  const [items, setItems] = useState(listElements || []);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      const updatedItems = reorder(items, result.source.index, result.destination.index);

      _onDragEnd && _onDragEnd(result);
      setItems(updatedItems);
    },
    [_onDragEnd, items],
  );

  const getListStyle = (isDraggingOver) => ({
    ...droppableStyles,

    ...(isDraggingOver && droppableDraggingStyle && droppableDraggingStyle),
  });

  const getItemStyle = (isDragging, providerStyles) => ({
    ...draggableStyles,

    ...providerStyles,

    ...(isDragging && draggableDraggingStyle),
  });

  useEffect(() => {
    if (listElements?.length) {
      const uniqueItems = listElements.map((item, index) => ({
        ...item,
        itemId: `${item._id}-${Date.now()}-${index}` || `temp-id-${index}-${Date.now()}`,
      }));
      setItems(uniqueItems);
    }
  }, [listElements]);

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onBeforeCapture={onBeforeCapture}
      onBeforeDragStart={onBeforeDragStart}
    >
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <tbody
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            className={droppableClassName}
          >
            {items.map((item, index, all) => (
              <Draggable key={item.itemId} draggableId={item._id} index={index} isDragDisabled={isDragDisabled}>
                {(provided, snapshot) => {
                  const conditionalClass = selectedItem?.includes(item?._id) ? selectedItemClass : '';

                  return (
                    <tr
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...(!separateDraggingElement ? provided.dragHandleProps : {})}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      className={`${style.relativeClass} ${draggableClassName} ${conditionalClass}`}
                    >
                      {renderContent && renderContent(item, index, all, provided)}
                    </tr>
                  );
                }}
              </Draggable>
            ))}
            {provided.placeholder}
          </tbody>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableComponent;
