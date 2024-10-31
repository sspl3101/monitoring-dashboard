export const configureLED = (ledId, status) => {
    const configs = {
      critical: {
        color: 'red',
        animation: 'flash-fast'
      },
      alert: {
        color: 'orange',
        animation: 'flash-medium'
      },
      warning: {
        color: 'yellow',
        animation: 'flash-slow'
      },
      normal: {
        color: 'green',
        animation: 'none'
      }
    };
  
    return configs[status] || configs.normal;
  };
  
  export const calculateDiskSpace = (freeDisk, totalDisk) => {
    const freeSpace = parseFloat(freeDisk);
    const totalSpace = parseFloat(totalDisk);
    if (isNaN(freeSpace) || isNaN(totalSpace) || totalSpace === 0) return 0;
    return (freeSpace / totalSpace) * 100;
  };
  
  export const getDiskStatus = (freePercentage) => {
    const usagePercentage = 100 - freePercentage;
    if (usagePercentage > 95) return 'critical';
    if (usagePercentage > 85) return 'alert';
    if (usagePercentage > 75) return 'warning';
    return 'normal';
  };
  
  export const getDiskUsageStyle = (usagePercentage) => {
    if (usagePercentage > 95) {
      return 'text-red-600 font-bold animate-pulse';
    }
    if (usagePercentage > 85) {
      return 'text-orange-600 font-semibold';
    }
    if (usagePercentage > 75) {
      return 'text-yellow-600';
    }
    return 'text-green-600';
  };
  
  export const setLocalTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };