// src/server/routes/vmLogs.js
import express from 'express';

export const setupVMLogRoutes = (pool) => {
  const router = express.Router();

  // Get VM configurations for a router
  router.get('/routers/:id/vm-configs', async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM vm_log_configs WHERE router_id = ?',
        [req.params.id]
      );
      res.json(rows);
    } catch (error) {
      console.error('Error fetching VM configs:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};4