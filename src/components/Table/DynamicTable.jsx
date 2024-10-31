import React, { useState, useMemo, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { StatusCell } from './StatusCell';
import { ExpandedRowDetails } from './ExpandedRowDetails';
import { setLocalTimezone, getDiskUsageStyle } from '../../utils/statusUtils';

const DraggableHeader = ({ header, index }) => {
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
            <div className="drag-handle absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 opacity-50 hover:opacity-100">
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

export const DynamicTable = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [sorting, setSorting] = useState([]);
  const [columnOrder, setColumnOrder] = useState([]);
  const timezone = setLocalTimezone();

  const handleRowExpand = (rowId) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  const columns = useMemo(
    () => [
      {
        id: 'id',
        header: 'Sl #',
        accessorKey: 'id',
      },
      {
        id: 'router_id',
        header: 'Router ID',
        accessorKey: 'router_id',
      },
      {
        id: 'facility',
        header: 'Facility',
        accessorKey: 'facility',
      },
      {
        id: 'router_alias',
        header: 'Router Alias',
        accessorKey: 'router_alias',
      },
      {
        id: 'last_seen',
        header: `Last Seen (${timezone})`,
        accessorKey: 'last_seen',
      },
      {
        id: 'vpn_status',
        header: 'VPN Status',
        accessorKey: 'vpn_status',
        cell: ({ getValue }) => <StatusCell value={getValue()} />,
      },
      {
        id: 'app_status',
        header: 'App Status',
        accessorKey: 'app_status',
        cell: ({ getValue }) => <StatusCell value={getValue()} />,
      },
      {
        id: 'system_status',
        header: 'System Status',
        accessorKey: 'system_status',
        cell: ({ getValue, row }) => (
          <StatusCell
            value={getValue()}
            onClick={() => handleRowExpand(row.original.id)}
          />
        ),
      },
      {
        id: 'free_disk',
        header: 'Free Disk Space',
        accessorKey: 'free_disk',
        cell: ({ getValue }) => getValue().toFixed(0),
      },
      {
        id: 'total_disk',
        header: 'Total Disk Space',
        accessorKey: 'total_disk',
        cell: ({ getValue }) => getValue().toFixed(0),
      },
      {
        id: 'disk_usage',
        header: 'Disk Usage',
        accessorKey: 'disk_usage',
        cell: ({ getValue }) => {
          const value = parseFloat(getValue());
          return (
            <div className={getDiskUsageStyle(value)}>
              {value.toFixed(1)}%
            </div>
          );
        },
      },
    ],
    [timezone]
  );

  useEffect(() => {
    if (columnOrder.length === 0) {
      setColumnOrder(columns.map(col => col.id));
    }
  }, [columns]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newOrder = Array.from(columnOrder);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    
    console.log('New column order:', newOrder);
    setColumnOrder(newOrder);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnOrder,
    },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
      <table className="min-w-full bg-white">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="thead" direction="horizontal">
            {(provided) => (
              <thead
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                      <DraggableHeader 
                        key={header.id} 
                        header={header} 
                        index={index} 
                      />
                    ))}
                    {provided.placeholder}
                  </tr>
                ))}
              </thead>
            )}
          </Droppable>
        </DragDropContext>

        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row, index) => (
            <React.Fragment key={row.original.id}>
              <tr className={`
                border-b border-gray-200 
                ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                hover:bg-gray-100 transition-colors duration-150 ease-in-out
              `}>
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    className="p-3 border-r border-gray-200 text-center"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {expandedRows.has(row.original.id) && (
                <ExpandedRowDetails data={row.original} />
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};