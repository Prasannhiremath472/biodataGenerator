-- ============================================================================
-- Biodata Generator — Full MySQL Schema
-- Engine: InnoDB, Charset: utf8mb4 (full Unicode incl. all 11 supported scripts)
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- users
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- refresh_tokens (supports JWT refresh + revocation, logout-everywhere)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- languages
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS languages (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(10)   NOT NULL,           -- en, hi, mr, kn, ta, te, gu, pa, bn, ml, ur
  name        VARCHAR(100)  NOT NULL,           -- English, Hindi, Marathi, ...
  native_name VARCHAR(100)  NOT NULL,           -- English, हिन्दी, मराठी, ...
  is_rtl      TINYINT(1)    NOT NULL DEFAULT 0, -- true for Urdu
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

-- ----------------------------------------------------------------------------
-- translations (UI dictionary, keyed by language + namespace + key)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- template_categories
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS template_categories (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,   -- Traditional, Modern, Premium, Professional, Photo-Centric, Wedding Style
  slug        VARCHAR(120)  NOT NULL,
  description VARCHAR(255)  NULL,
  sort_order  INT           NOT NULL DEFAULT 0,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  DATETIME      NULL,
  UNIQUE KEY uq_template_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- templates
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS templates (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id   BIGINT UNSIGNED NOT NULL,
  name          VARCHAR(150)    NOT NULL,
  slug          VARCHAR(170)    NOT NULL,
  description   VARCHAR(500)    NULL,
  thumbnail_url VARCHAR(500)    NULL,
  config_json   JSON            NOT NULL,   -- sections, theme, layout (see ARCHITECTURE.md)
  is_premium    TINYINT(1)      NOT NULL DEFAULT 0,
  status        ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  usage_count   INT UNSIGNED    NOT NULL DEFAULT 0,
  created_by    BIGINT UNSIGNED NULL,
  updated_by    BIGINT UNSIGNED NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    DATETIME        NULL,
  CONSTRAINT fk_templates_category FOREIGN KEY (category_id) REFERENCES template_categories(id) ON DELETE RESTRICT,
  CONSTRAINT fk_templates_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_templates_slug (slug),
  KEY idx_templates_category (category_id),
  KEY idx_templates_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- biodatas (the core document a user creates)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS biodatas (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  template_id     BIGINT UNSIGNED NULL,
  language_id     BIGINT UNSIGNED NOT NULL,
  title           VARCHAR(200)    NOT NULL DEFAULT 'Untitled Biodata',
  public_slug     VARCHAR(190)    NULL,        -- for SEO-friendly public page
  is_public       TINYINT(1)      NOT NULL DEFAULT 0,
  status          ENUM('draft','completed') NOT NULL DEFAULT 'draft',
  data_json       JSON            NOT NULL,    -- full structured biodata payload (personal, contact, education, family, etc.)
  about_me_html   MEDIUMTEXT      NULL,        -- rich text "About Me"
  qr_code_url     VARCHAR(500)    NULL,
  view_count      INT UNSIGNED    NOT NULL DEFAULT 0,
  created_by      BIGINT UNSIGNED NULL,
  updated_by      BIGINT UNSIGNED NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      DATETIME        NULL,
  CONSTRAINT fk_biodatas_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_biodatas_template FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL,
  CONSTRAINT fk_biodatas_language FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE RESTRICT,
  UNIQUE KEY uq_biodatas_public_slug (public_slug),
  KEY idx_biodatas_user (user_id),
  KEY idx_biodatas_template (template_id),
  KEY idx_biodatas_status (status),
  KEY idx_biodatas_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- biodata_sections (normalized per-section overrides: order, visibility, custom titles)
-- Complements data_json on biodatas — lets users reorder/toggle sections per template.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS biodata_sections (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  biodata_id    BIGINT UNSIGNED NOT NULL,
  section_key   VARCHAR(100)    NOT NULL,   -- personal_info, contact, education, occupation, family, lifestyle, partner_preferences, horoscope, about_me, gallery
  display_title VARCHAR(150)    NULL,
  sort_order    INT             NOT NULL DEFAULT 0,
  is_visible    TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    DATETIME        NULL,
  CONSTRAINT fk_biodata_sections_biodata FOREIGN KEY (biodata_id) REFERENCES biodatas(id) ON DELETE CASCADE,
  UNIQUE KEY uq_biodata_sections_biodata_key (biodata_id, section_key),
  KEY idx_biodata_sections_biodata (biodata_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- biodata_images (profile photo + gallery, with crop metadata)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS biodata_images (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  biodata_id    BIGINT UNSIGNED NOT NULL,
  image_type    ENUM('profile','gallery') NOT NULL DEFAULT 'gallery',
  url           VARCHAR(500)    NOT NULL,
  storage_key   VARCHAR(500)    NOT NULL,    -- key/path in storage backend, for deletion
  crop_meta_json JSON           NULL,        -- {x,y,width,height,rotate,zoom}
  sort_order    INT             NOT NULL DEFAULT 0,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    DATETIME        NULL,
  CONSTRAINT fk_biodata_images_biodata FOREIGN KEY (biodata_id) REFERENCES biodatas(id) ON DELETE CASCADE,
  KEY idx_biodata_images_biodata (biodata_id),
  KEY idx_biodata_images_type (image_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- template_customizations (per-user-biodata color/font/layout overrides over a template)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS template_customizations (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  biodata_id      BIGINT UNSIGNED NOT NULL,
  template_id     BIGINT UNSIGNED NOT NULL,
  color_overrides_json JSON       NULL,   -- {primary, secondary, accent, background, text}
  font_overrides_json  JSON       NULL,   -- {heading, body}
  layout_overrides_json JSON      NULL,   -- {variant, sectionOrder: []}
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      DATETIME        NULL,
  CONSTRAINT fk_template_customizations_biodata FOREIGN KEY (biodata_id) REFERENCES biodatas(id) ON DELETE CASCADE,
  CONSTRAINT fk_template_customizations_template FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
  UNIQUE KEY uq_template_customizations_biodata (biodata_id),
  KEY idx_template_customizations_template (template_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- downloads (download history — PDF/DOCX)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS downloads (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  biodata_id    BIGINT UNSIGNED NOT NULL,
  format        ENUM('pdf','docx') NOT NULL,
  file_url      VARCHAR(500)    NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_downloads_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_downloads_biodata FOREIGN KEY (biodata_id) REFERENCES biodatas(id) ON DELETE CASCADE,
  KEY idx_downloads_user (user_id),
  KEY idx_downloads_biodata (biodata_id),
  KEY idx_downloads_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- favorites (favorite templates)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS favorites (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  template_id   BIGINT UNSIGNED NOT NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_template FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
  UNIQUE KEY uq_favorites_user_template (user_id, template_id),
  KEY idx_favorites_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- subscriptions (plan/billing — supports premium templates gating)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  plan            ENUM('free','premium') NOT NULL DEFAULT 'free',
  status          ENUM('active','cancelled','expired') NOT NULL DEFAULT 'active',
  amount_paid     DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  currency        VARCHAR(10)     NOT NULL DEFAULT 'INR',
  starts_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ends_at         DATETIME        NULL,
  payment_reference VARCHAR(255) NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      DATETIME        NULL,
  CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_subscriptions_user (user_id),
  KEY idx_subscriptions_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- audit_logs (admin/system action trail)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_user_id BIGINT UNSIGNED NULL,
  action        VARCHAR(150)    NOT NULL,    -- e.g. 'user.block', 'template.publish', 'biodata.delete'
  entity_type   VARCHAR(100)    NOT NULL,    -- e.g. 'user', 'template', 'biodata'
  entity_id     BIGINT UNSIGNED NULL,
  metadata_json JSON            NULL,
  ip_address    VARCHAR(45)     NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_logs_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL,
  KEY idx_audit_logs_actor (actor_user_id),
  KEY idx_audit_logs_entity (entity_type, entity_id),
  KEY idx_audit_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
