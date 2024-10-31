import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../../utils/apiConfig';
import LogTrailing from '../components/LogTrailing/LogTrailing';

const LogTrailing = () => {
  console.log('LogTrailing component mounting');
  const [isOpen, setIsOpen] = useState(true);
  const [selectedRouter, setSelectedRouter] = useState(null);
  const [selectedVM, setSelectedVM] = useState(null);
  const [routers, setRouters] = useState([]);
  const [vmConfigs, setVMConfigs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const websocket = useRef(null);
  const logContainerRef = useRef(null);

  

  useEffect(() => {
    const fetchRouters = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/routers`);
        if (!response.ok) throw new Error('Failed to fetch routers');
        const data = await response.json();
        setRouters(data);
      } catch (err) {
        setError('Failed to load routers');
        console.error(err);
      }
    };
    fetchRouters();
  }, []);

  useEffect(() => {
    if (selectedRouter) {
      const fetchVMConfigs = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/routers/${selectedRouter}/vm-configs`);
          if (!response.ok) throw new Error('Failed to fetch VM configs');
          const data = await response.json();
          setVMConfigs(data);
          setSelectedVM(null);
        } catch (err) {
          setError('Failed to load VM configurations');
          console.error(err);
        }
      };
      fetchVMConfigs();
    }
  }, [selectedRouter]);

  useEffect(() => {
    if (selectedRouter && selectedVM) {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/logs/${selectedRouter}/${selectedVM}`;
      
      console.log('Attempting WebSocket connection to:', wsUrl);
      
      websocket.current = new WebSocket(wsUrl);

      websocket.current.onopen = () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
        setError(null);
      };

      websocket.current.onmessage = (event) => {
        try {
          const newLog = JSON.parse(event.data);
          setLogs(prevLogs => [...prevLogs, newLog]);
          
          if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
          }
        } catch (err) {
          console.error('Error parsing log message:', err);
        }
      };

      websocket.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
        setIsConnected(false);
      };

      websocket.current.onclose = () => {
        console.log('WebSocket Disconnected');
        setIsConnected(false);
      };

      return () => {
        if (websocket.current) {
          websocket.current.close();
        }
      };
    }
  }, [selectedRouter, selectedVM]);

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg mt-6 border border-gray-200">
      <div 
        className="p-4 bg-gray-50 rounded-t-lg border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-700">Log Trailing</h2>
          {isConnected && (
            <span className="ml-3 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              Connected
            </span>
          )}
        </div>
        <button 
          className="text-gray-500 hover:text-gray-700 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </button>
      </div>
      
      {isOpen && (
        <div className="p-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <select
              className="flex-1 min-w-[200px] p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedRouter || ''}
              onChange={(e) => setSelectedRouter(e.target.value)}
            >
              <option value="">Select Router</option>
              {routers.map((router) => (
                <option key={router.id} value={router.id}>
                  {router.router_id} ({router.facility})
                </option>
              ))}
            </select>

            <select
              className="flex-1 min-w-[200px] p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedVM || ''}
              onChange={(e) => setSelectedVM(e.target.value)}
              disabled={!selectedRouter}
            >
              <option value="">Select VM</option>
              {vmConfigs.map((config) => (
                <option key={config.vm_number} value={config.vm_number}>
                  VM {config.vm_number} ({config.vm_ip})
                </option>
              ))}
            </select>

            <button
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={clearLogs}
            >
              Clear Logs
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                {error}
              </p>
            </div>
          )}

          <div 
            ref={logContainerRef}
            className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm h-96 overflow-y-auto"
          >
            {logs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap mb-1">
                <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-gray-500 italic">
                {selectedRouter && selectedVM 
                  ? isConnected 
                    ? 'Waiting for logs...' 
                    : 'Connecting...'
                  : 'Select a router and VM to start viewing logs...'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogTrailing;