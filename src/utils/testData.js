import { calculateDiskSpace, getDiskStatus } from './statusUtils';

export const generateTestData = (index) => {
  const totalDisk = 500;
  const freeDisk = Math.floor(Math.random() * totalDisk * (index % 4 === 0 ? 0.02 : index % 3 === 0 ? 0.1 : index % 2 === 0 ? 0.2 : 0.8));
  const vmStatuses = Array(11)
    .fill(null)
    .map(() => ['normal', 'warning', 'alert', 'critical'][Math.floor(Math.random() * 4)]);
  
  return {
    id: index,
    routerId: `Router-${index}`,
    facility: `Facility-${index}`,
    alias: `Alias-${index}`,
    lastSeen: new Date().toLocaleTimeString(),
    vpnStatus: vmStatuses[0],
    appStatus: vmStatuses[1],
    systemStatus: getDiskStatus(calculateDiskSpace(freeDisk, totalDisk)),
    freeDisk,
    totalDisk,
    diskUsage: (100 - calculateDiskSpace(freeDisk, totalDisk)).toFixed(1),
    vmStatuses
  };
};