-- Seed: default admin user
-- Password is "ChangeMe123!" hashed with bcrypt (cost 10). CHANGE THIS IMMEDIATELY after first deploy.
SET NAMES utf8mb4;

INSERT INTO users (full_name, email, mobile_number, password_hash, role, status, is_email_verified)
VALUES (
  'System Admin',
  'admin@biodatagenerator.local',
  '0000000000',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'admin',
  'active',
  1
)
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);
