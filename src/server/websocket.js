import { WebSocketServer } from 'ws';
import SSH2Promise from 'ssh2-promise';
import CredentialManager from './services/credentialManager.js';
import { config } from './config.js';

export const setupWebSocket = (server, pool) => {
  const wss = new WebSocketServer({ server });
  const credentialManager = new CredentialManager(pool);

  wss.on('connection', async (ws, req) => {
    const matches = req.url.match(/\/logs\/(\d+)\/(\d+)/);
    if (!matches) {
      ws.close();
      return;
    }

    const [, routerId, vmNumber] = matches;
    let ssh = null;
    
    try {
      // Get VM credentials
      const credentials = await credentialManager.getVMCredentials(routerId, vmNumber);
      
      // Create SSH connection with credentials
      ssh = new SSH2Promise(credentials);
      
      // Connect to VM and tail the log file
      await ssh.connect();
      const stream = await ssh.exec('tail -f ' + credentials.logPath);

      stream.on('data', (data) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({
            timestamp: new Date().toISOString(),
            message: data.toString().trim()
          }));
        }
      });

      // Handle WebSocket close
      ws.on('close', () => {
        if (ssh) {
          ssh.close().catch(console.error);
        }
      });

      // Handle SSH errors
      ssh.on('error', (error) => {
        console.error('SSH Error:', error);
        ws.send(JSON.stringify({
          timestamp: new Date().toISOString(),
          message: `SSH Error: ${error.message}`
        }));
      });

    } catch (error) {
      console.error('WebSocket Error:', error);
      ws.send(JSON.stringify({
        timestamp: new Date().toISOString(),
        message: `Error: ${error.message}`
      }));
      ws.close();
    }
  });

  return wss;
};