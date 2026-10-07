-- Migration 004: biodatas + biodata_sections + biodata_images + template_customizations
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS biodatas (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  template_id     BIGINT UNSIGNED NULL,
  language_id     BIGINT UNSIGNED NOT NULL,
  title           VARCHAR(200)    NOT NULL DEFAULT 'Untitled Biodata',
  public_slug     VARCHAR(190)    NULL,
  is_public       TINYINT(1)      NOT NULL DEFAULT 0,
  status          ENUM('draft','completed') NOT NULL DEFAULT 'draft',
  data_json       JSON            NOT NULL,
  about_me_html   MEDIUMTEXT      NULL,
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

CREATE TABLE IF NOT EXISTS biodata_sections (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  biodata_id    BIGINT UNSIGNED NOT NULL,
  section_key   VARCHAR(100)    NOT NULL,
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

CREATE TABLE IF NOT EXISTS biodata_images (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  biodata_id    BIGINT UNSIGNED NOT NULL,
  image_type    ENUM('profile','gallery') NOT NULL DEFAULT 'gallery',
  url           VARCHAR(500)    NOT NULL,
  storage_key   VARCHAR(500)    NOT NULL,
  crop_meta_json JSON           NULL,
  sort_order    INT             NOT NULL DEFAULT 0,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    DATETIME        NULL,
  CONSTRAINT fk_biodata_images_biodata FOREIGN KEY (biodata_id) REFERENCES biodatas(id) ON DELETE CASCADE,
  KEY idx_biodata_images_biodata (biodata_id),
  KEY idx_biodata_images_type (image_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS template_customizations (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  biodata_id      BIGINT UNSIGNED NOT NULL,
  template_id     BIGINT UNSIGNED NOT NULL,
  color_overrides_json JSON       NULL,
  font_overrides_json  JSON       NULL,
  layout_overrides_json JSON      NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      DATETIME        NULL,
  CONSTRAINT fk_template_customizations_biodata FOREIGN KEY (biodata_id) REFERENCES biodatas(id) ON DELETE CASCADE,
  CONSTRAINT fk_template_customizations_template FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
  UNIQUE KEY uq_template_customizations_biodata (biodata_id),
  KEY idx_template_customizations_template (template_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
