-- Migration 001: users + refresh_tokens
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name         VARCHAR(150)        NOT NULL,
  email             VARCHAR(190)        NOT NULL,
  mobile_number     VARCHAR(20)         NOT NULL,
  password_hash     VARCHAR(255)        NOT NULL,
  role              ENUM('user','admin') NOT NULL DEFAULT 'user',
  status            ENUM('active','blocked') NOT NULL DEFAULT 'active',
  is_email_verified TINYINT(1)          NOT NULL DEFAULT 0,
  email_verify_token        VARCHAR(255) NULL,
  email_verify_expires_at   DATETIME     NULL,
  password_reset_token      VARCHAR(255) NULL,
  password_reset_expires_at DATETIME     NULL,
  preferred_language_id BIGINT UNSIGNED NULL,
  theme_preference  ENUM('light','dark') NOT NULL DEFAULT 'light',
  last_login_at     DATETIME            NULL,
  created_by        BIGINT UNSIGNED     NULL,
  updated_by        BIGINT UNSIGNED     NULL,
  created_at        DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at        DATETIME            NULL,
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_mobile (mobile_number),
  KEY idx_users_status (status),
  KEY idx_users_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  token_hash    VARCHAR(255)    NOT NULL,
  user_agent    VARCHAR(255)    NULL,
  ip_address    VARCHAR(45)     NULL,
  expires_at    DATETIME        NOT NULL,
  revoked_at    DATETIME        NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_refresh_tokens_user (user_id),
  KEY idx_refresh_tokens_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
