
// server.js
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import http from 'http';
import { setupWebSocket } from './src/server/websocket.js';
import { setupVMLogRoutes } from './src/server/routes/vmLogs.js';
import { setupDatabaseRoutes } from './src/server/routes/databaseRoutes.js';
import { createPool, testConnection } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server (needed for WebSocket)
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static('dist'));

// Create database pool
let pool;

// Existing API Routes
app.get('/api/routers', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        router_id,
        facility,
        router_alias,
        last_seen,
        vpn_status,
        app_status,
        system_status,
        free_disk,
        total_disk,
        ROUND((1 - free_disk/total_disk) * 100, 1) as disk_usage
      FROM routers
      ORDER BY id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/routers/:id/vms', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT vm_number, vm_status FROM vm_details WHERE router_id = ? ORDER BY vm_number',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.use('/api', setupDatabaseRoutes(pool));

// Setup VM Log routes
app.use('/api', setupVMLogRoutes(pool));

// Setup WebSocket
const wss = setupWebSocket(server, pool);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Initialize server
const initializeServer = async () => {
  try {
    // Create database pool
    pool = await createPool();
    
    // Start server
    server.listen(PORT, async () => {
      console.log(`Server running on http://localhost:${PORT}`);
      const isConnected = await testConnection(pool);
      if (isConnected) {
        console.log('Server is ready to accept connections');
      }
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

initializeServer();