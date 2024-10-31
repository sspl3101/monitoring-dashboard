const API_BASE_URL = 'http://localhost:3001';

export const fetchRouters = async () => {
  try {
    console.log('Fetching data from:', `${API_BASE_URL}/api/routers`);
    const response = await fetch(`${API_BASE_URL}/api/routers`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching router data:', error);
    throw error;
  }
};

export const fetchVMDetails = async (routerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/routers/${routerId}/vms`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched VM details:', data);
    return data;
  } catch (error) {
    console.error('Error fetching VM details:', error);
    throw error;
  }
};