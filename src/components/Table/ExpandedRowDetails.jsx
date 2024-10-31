import React, { useState, useEffect } from 'react';
import { configureLED } from '../../utils/statusUtils';
import { API_BASE_URL } from '../../utils/apiConfig';

export const ExpandedRowDetails = ({ data }) => {
  const [vmDetails, setVmDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVMDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/routers/${data.id}/vms`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch VM details: ${response.statusText}`);
        }
        
        const details = await response.json();
        console.log('VM Details fetched:', details);
        setVmDetails(details);
        setError(null);
      } catch (err) {
        console.error('Error fetching VM details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (data.id) {
      fetchVMDetails();
    }
  }, [data.id]);

  if (loading) {
    return (
      <tr className="bg-gray-50">
        <td colSpan="11" className="p-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-gray-600">Loading VM details...</span>
          </div>
        </td>
      </tr>
    );
  }

  if (error) {
    return (
      <tr className="bg-gray-50">
        <td colSpan="11" className="p-4">
          <div className="text-red-500 text-center">
            Error: {error}
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="bg-gray-50">
      <td colSpan="11" className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="border-b pb-2 mb-4">
            <h3 className="text-sm font-medium text-gray-700">
              Virtual Machines Status for {data.router_id}
            </h3>
          </div>
          <div className="grid grid-cols-11 gap-4">
            {vmDetails.map((vm) => (
              <div key={vm.vm_number} className="text-center">
                <div className="text-sm font-medium mb-2">VM{vm.vm_number}</div>
                <div 
                  className={`
                    w-4 h-4 rounded-full mx-auto shadow-inner 
                    ${configureLED('', vm.vm_status).color} 
                    ${configureLED('', vm.vm_status).animation}
                  `}
                  title={`Status: ${vm.vm_status}`}
                />
              </div>
            ))}
          </div>
        </div>
      </td>
    </tr>
  );
};