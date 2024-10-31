// src/server/routes/databaseRoutes.js
import express from 'express';

export const setupDatabaseRoutes = (pool) => {
  const router = express.Router();

  // Add new router
  router.post('/routers', async (req, res) => {
    try {
      const { 
        router_id, 
        facility, 
        router_alias, 
        vpn_status, 
        app_status, 
        system_status,
        free_disk,
        total_disk 
      } = req.body;

      const [result] = await pool.query(
        `INSERT INTO routers 
         (router_id, facility, router_alias, vpn_status, app_status, system_status, free_disk, total_disk) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [router_id, facility, router_alias, vpn_status, app_status, system_status, free_disk, total_disk]
      );

      res.status(201).json({ 
        message: 'Router added successfully', 
        id: result.insertId 
      });
    } catch (error) {
      console.error('Error adding router:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Add VM details for a router
  router.post('/routers/:id/vms', async (req, res) => {
    try {
      const { vm_number, vm_status } = req.body;
      const router_id = req.params.id;

      const [result] = await pool.query(
        `INSERT INTO vm_details (router_id, vm_number, vm_status) 
         VALUES (?, ?, ?)`,
        [router_id, vm_number, vm_status]
      );

      res.status(201).json({ 
        message: 'VM details added successfully', 
        id: result.insertId 
      });
    } catch (error) {
      console.error('Error adding VM details:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Add VM log configuration
  router.post('/routers/:id/vm-configs', async (req, res) => {
    try {
      const { vm_number, vm_ip, log_path } = req.body;
      const router_id = req.params.id;

      const [result] = await pool.query(
        `INSERT INTO vm_log_configs (router_id, vm_number, vm_ip, log_path) 
         VALUES (?, ?, ?, ?)`,
        [router_id, vm_number, vm_ip, log_path]
      );

      res.status(201).json({ 
        message: 'VM log configuration added successfully', 
        id: result.insertId 
      });
    } catch (error) {
      console.error('Error adding VM log config:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update router status
  router.put('/routers/:id', async (req, res) => {
    try {
      const { 
        vpn_status, 
        app_status, 
        system_status,
        free_disk,
        total_disk 
      } = req.body;

      await pool.query(
        `UPDATE routers 
         SET vpn_status = ?, 
             app_status = ?, 
             system_status = ?,
             free_disk = ?,
             total_disk = ?,
             last_seen = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [vpn_status, app_status, system_status, free_disk, total_disk, req.params.id]
      );

      res.json({ message: 'Router status updated successfully' });
    } catch (error) {
      console.error('Error updating router:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update VM status
  router.put('/routers/:routerId/vms/:vmNumber', async (req, res) => {
    try {
      const { vm_status } = req.body;

      await pool.query(
        `UPDATE vm_details 
         SET vm_status = ? 
         WHERE router_id = ? AND vm_number = ?`,
        [vm_status, req.params.routerId, req.params.vmNumber]
      );

      res.json({ message: 'VM status updated successfully' });
    } catch (error) {
      console.error('Error updating VM status:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};