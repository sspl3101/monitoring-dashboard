// src/server/routes/index.js
import express from 'express';
import { setupVMLogRoutes } from './vmLogs.js';

export const setupRoutes = (pool) => {
  const router = express.Router();

  // Existing routes for routers
  router.get('/routers', async (req, res) => {
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

  router.get('/routers/:id/vms', async (req, res) => {
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

  // Add VM log routes
  router.use('/api', setupVMLogRoutes(pool));

  return router;
};