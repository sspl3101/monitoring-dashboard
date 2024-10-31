// src/server/config.js

export const config = {
    // Database configuration
    db: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'router_monitoring',
      port: parseInt(process.env.DB_PORT || '3306'),
    },
    
    // SSH defaults
    ssh: {
      defaultUsername: process.env.SSH_DEFAULT_USERNAME || 'admin',
      defaultPassword: process.env.SSH_DEFAULT_PASSWORD,
      defaultKeyPath: process.env.SSH_DEFAULT_KEY_PATH,
      connectionTimeout: parseInt(process.env.SSH_CONNECTION_TIMEOUT || '10000'),
    },
    
    // Server configuration
    server: {
      port: parseInt(process.env.PORT || '3001'),
      host: process.env.HOST || 'localhost',
    },
    
    // Security
    security: {
      encryptionKey: process.env.ENCRYPTION_KEY,
    }
  };
  
  // Export both named and default for flexibility
  export default config;