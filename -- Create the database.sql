-- Show all databases
SHOW DATABASES;

-- Use our database
USE router_monitoring;

-- Show all tables
SHOW TABLES;

-- Create routers table
CREATE TABLE routers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    router_id VARCHAR(50) NOT NULL,
    facility VARCHAR(100),
    router_alias VARCHAR(100),
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vpn_status VARCHAR(20),
    app_status VARCHAR(20),
    system_status VARCHAR(20),
    free_disk BIGINT,
    total_disk BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_router_id (router_id)
);

-- Create vm_details table
CREATE TABLE vm_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    router_id VARCHAR(50),
    vm_number INT NOT NULL,
    vm_status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (router_id) REFERENCES routers(router_id),
    UNIQUE KEY unique_vm (router_id, vm_number)
);

-- Create vm_log_configs table
CREATE TABLE vm_log_configs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    router_id VARCHAR(50),
    vm_number INT NOT NULL,
    vm_ip VARCHAR(45) NOT NULL,
    log_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (router_id) REFERENCES routers(router_id),
    UNIQUE KEY unique_vm_config (router_id, vm_number)
);

-- Add indexes for better query performance
CREATE INDEX idx_router_status ON routers(vpn_status, app_status, system_status);
CREATE INDEX idx_vm_status ON vm_details(vm_status);
CREATE INDEX idx_router_facility ON routers(facility);

-- Optional: Insert sample data for testing
INSERT INTO routers (router_id, facility, router_alias, vpn_status, app_status, system_status, free_disk, total_disk) 
VALUES 
('ROUTER001', 'Facility A', 'Main Router', 'CONNECTED', 'RUNNING', 'HEALTHY', 800000000000, 1000000000000),
('ROUTER002', 'Facility B', 'Backup Router', 'CONNECTED', 'RUNNING', 'HEALTHY', 750000000000, 1000000000000);

INSERT INTO vm_details (router_id, vm_number, vm_status) 
VALUES 
('ROUTER001', 1, 'RUNNING'),
('ROUTER001', 2, 'RUNNING'),
('ROUTER002', 1, 'RUNNING');

INSERT INTO vm_log_configs (router_id, vm_number, vm_ip, log_path) 
VALUES 
('ROUTER001', 1, '172.28.209.185', '/var/log/syslog'),
('ROUTER001', 2, '192.168.1.11', '/var/log/vm2.log'),
('ROUTER002', 1, '192.168.2.10', '/var/log/vm1.log');
-- Verify data
SELECT * FROM routers;
SELECT * FROM vm_details;
SELECT * FROM vm_log_configs

-- Add encryption functions (MySQL example)
DELIMITER //

CREATE FUNCTION encrypt_string(p_string VARCHAR(255), p_key VARCHAR(32))
RETURNS VARBINARY(255)
DETERMINISTIC
BEGIN
    RETURN AES_ENCRYPT(p_string, p_key);
END //

CREATE FUNCTION decrypt_string(p_string VARBINARY(255), p_key VARCHAR(32))
RETURNS VARCHAR(255)
DETERMINISTIC
BEGIN
    RETURN AES_DECRYPT(p_string, p_key);
END //

DELIMITER ;

-- Update vm_log_configs table to include credentials
ALTER TABLE vm_log_configs
ADD COLUMN ssh_username VARCHAR(100) NULL,
ADD COLUMN ssh_password VARBINARY(255) NULL,
ADD COLUMN ssh_key_path VARCHAR(255) NULL,
ADD COLUMN auth_type ENUM('password', 'key') DEFAULT 'password',
ADD COLUMN custom_options TEXT NULL;

-- Add indexes
CREATE INDEX idx_vm_auth ON vm_log_configs(auth_type);

-- Example of inserting encrypted credentials (DO NOT store real credentials in SQL files)
-- INSERT INTO vm_log_configs 
-- (router_id, vm_number, vm_ip, log_path, ssh_username, ssh_password, auth_type)
-- VALUES 
-- ('ROUTER001', 1, '192.168.1.10', '/var/log/vm1.log', 
--  'admin', encrypt_string('password123', 'your-encryption-key'), 'password');