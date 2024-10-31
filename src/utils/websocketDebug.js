export const debugWebSocket = (url) => {
    console.group('WebSocket Debug Info');
    console.log('Connection URL:', url);
    console.log('Protocol:', window.location.protocol);
    console.log('Host:', window.location.host);
    console.log('Origin:', window.location.origin);
    console.groupEnd();
  };
  
  export const logWebSocketEvent = (event, data) => {
    console.group(`WebSocket Event: ${event}`);
    console.log('Timestamp:', new Date().toISOString());
    console.log('Data:', data);
    console.groupEnd();
  };