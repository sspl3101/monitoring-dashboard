import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { flexRender } from '@tanstack/react-table';

export const DraggableHeader = ({ header, index }) => {
  return (
    <Draggable draggableId={header.id} index={index}>
      {(provided, snapshot) => (
        <th
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            relative p-3 border-b border-r border-gray-200 
            text-center font-semibold 
            ${snapshot.isDragging ? 'bg-gray-100 shadow-lg' : 'bg-gradient-to-r from-gray-100 to-gray-50'}
          `}
          onClick={header.column.getToggleSortingHandler()}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="drag-handle absolute left-1 top-1/2 -translate-y-1/2 text-gray-400">
              ⋮⋮
            </div>
            <div className="pl-6">
              {flexRender(header.column.columnDef.header, header.getContext())}
              {header.column.getIsSorted() && (
                <span className="ml-2">
                  {header.column.getIsSorted() === "asc" ? "↑" : "↓"}
                </span>
              )}
            </div>
          </div>
        </th>
      )}
    </Draggable>
  );
};