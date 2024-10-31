import { config } from '../config.js';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

class CredentialManager {
  constructor(pool) {
    this.pool = pool;
    this.algorithm = 'aes-256-gcm';
    this.encryptionKey = Buffer.from(config.security.encryptionKey || '', 'hex');
  }

  async getVMCredentials(routerId, vmNumber) {
    try {
      const [rows] = await this.pool.query(
        `SELECT 
          vm_ip,
          ssh_username,
          ssh_password,
          ssh_key_path,
          auth_type,
          custom_options
         FROM vm_log_configs 
         WHERE router_id = ? AND vm_number = ?`,
        [routerId, vmNumber]
      );

      if (rows.length === 0) {
        throw new Error('VM configuration not found');
      }

      const vmConfig = rows[0];
      
      return {
        host: vmConfig.vm_ip,
        username: vmConfig.ssh_username || config.ssh.defaultUsername,
        password: vmConfig.ssh_password || config.ssh.defaultPassword,
        privateKey: vmConfig.ssh_key_path || config.ssh.defaultKeyPath,
        timeout: config.ssh.connectionTimeout,
        ...(vmConfig.custom_options ? JSON.parse(vmConfig.custom_options) : {})
      };
    } catch (error) {
      console.error('Error fetching VM credentials:', error);
      throw error;
    }
  }

  async encryptPassword(password) {
    try {
      const iv = randomBytes(16);
      const cipher = createCipheriv(this.algorithm, this.encryptionKey, iv);
      
      let encrypted = cipher.update(password, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: cipher.getAuthTag().toString('hex')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  }

  async decryptPassword(encryptedData) {
    try {
      const decipher = createDecipheriv(
        this.algorithm, 
        this.encryptionKey,
        Buffer.from(encryptedData.iv, 'hex')
      );
      
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw error;
    }
  }
}

export default CredentialManager;