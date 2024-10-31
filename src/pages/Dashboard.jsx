import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import LogTrailing from '../components/LogTrailing/LogTrailing';
import Table from '../components/Table';
import Legend from '../components/Legend';
import Logo from '../components/Logo';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Logo */}
      <Logo />

      {/* Legend */}
      <div className="mb-6">
        <Legend />
      </div>
      
      {/* Table */}
      <div className="mb-6">
        <Table />
      </div>
      
      {/* Log Trailing with Error Boundary */}
      <div className="mb-6">
        <ErrorBoundary>
          <LogTrailing />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Dashboard;