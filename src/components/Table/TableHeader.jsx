import React from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import DraggableHeader from './DraggableHeader';

const TableHeader = ({ headerGroup, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided) => (
          <tr
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {headerGroup.headers.map((header, index) => (
              <DraggableHeader key={header.id} header={header} index={index} />
            ))}
            {provided.placeholder}
          </tr>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TableHeader;