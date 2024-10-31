import React, { useState } from 'react';

const Legend = () => {
  const [isOpen, setIsOpen] = useState(true);

  const ledStatuses = [
    { status: 'normal', label: 'Normal', color: 'green' },
    { status: 'warning', label: 'Warning', color: 'yellow' },
    { status: 'alert', label: 'Alert', color: 'orange' },
    { status: 'critical', label: 'Critical', color: 'red' }
  ];

  const diskUsageLevels = [
    { range: '0-75%', label: 'Normal', color: 'text-green-600' },
    { range: '75-85%', label: 'Warning', color: 'text-yellow-600' },
    { range: '85-95%', label: 'Alert', color: 'text-orange-600' },
    { range: '95-100%', label: 'Critical', color: 'text-red-600 animate-pulse font-bold' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg"> {/* Removed mb-6 class */}
      <div 
        className="p-4 bg-gray-50 rounded-t-lg border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold text-gray-700">Status Legend</h2>
        <button className="text-gray-500 hover:text-gray-700">
          {isOpen ? '▼' : '▶'}
        </button>
      </div>
      
      {isOpen && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700">LED Status Indicators</h3>
            <div className="grid grid-cols-2 gap-4">
              {ledStatuses.map(({ status, label, color }) => (
                <div key={status} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full shadow-inner ${color} ${status === 'critical' ? 'flash-fast' : status === 'alert' ? 'flash-medium' : status === 'warning' ? 'flash-slow' : ''}`} />
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700">Disk Usage Levels</h3>
            <div className="grid grid-cols-2 gap-4">
              {diskUsageLevels.map(({ range, label, color }) => (
                <div key={range} className="flex items-center gap-3">
                  <span className={`text-sm ${color}`}>{range}</span>
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 mt-4 border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500">
              • Click on System Status LED to expand VM details
              <br />
              • Click column headers to sort data
              <br />
              • Drag column headers to reorder columns
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Legend;