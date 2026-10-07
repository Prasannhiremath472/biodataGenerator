-- Migration 002: languages + translations + users.preferred_language_id FK
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS languages (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(10)   NOT NULL,
  name        VARCHAR(100)  NOT NULL,
  native_name VARCHAR(100)  NOT NULL,
  is_rtl      TINYINT(1)    NOT NULL DEFAULT 0,
  font_family VARCHAR(100)  NOT NULL DEFAULT 'Noto Sans',
  is_active   TINYINT(1)    NOT NULL DEFAULT 1,
  sort_order  INT           NOT NULL DEFAULT 0,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  DATETIME      NULL,
  UNIQUE KEY uq_languages_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE users
  ADD CONSTRAINT fk_users_preferred_language
  FOREIGN KEY (preferred_language_id) REFERENCES languages(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS translations (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  language_id   BIGINT UNSIGNED NOT NULL,
  namespace     VARCHAR(100)    NOT NULL DEFAULT 'common',
  translation_key VARCHAR(255)  NOT NULL,
  value         TEXT            NOT NULL,
  created_by    BIGINT UNSIGNED NULL,
  updated_by    BIGINT UNSIGNED NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    DATETIME        NULL,
  CONSTRAINT fk_translations_language FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
  UNIQUE KEY uq_translations_lang_ns_key (language_id, namespace, translation_key),
  KEY idx_translations_namespace (namespace)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
