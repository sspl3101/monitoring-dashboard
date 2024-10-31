import React, { useEffect, useState } from 'react';
import { Logo, Legend, DynamicTable } from './components';
import { fetchRouters } from './utils/api';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const routerData = await fetchRouters();
        console.log('Received data:', routerData);
        setData(routerData);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message || 'Failed to load router data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" onClick={(e) => e.preventDefault()}>
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Logo />
        </div>
        <div className="mb-6">
          <DynamicTable data={data} />
        </div>
        <div className="mt-2">
          <Legend />
        </div>
      </div>
    </div>
  );
};

export default App;