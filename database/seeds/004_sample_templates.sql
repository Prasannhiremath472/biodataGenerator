-- Seed: starter templates, one per category (full library of 25 added in templates phase)
SET NAMES utf8mb4;

INSERT INTO templates (category_id, name, slug, description, config_json, is_premium, status)
SELECT id, 'Marathi Traditional', 'marathi-traditional',
  'Classic Marathi-style biodata with maroon/gold accents and Devanagari-friendly typography.',
  JSON_OBJECT(
    'layout', 'single-column',
    'theme', JSON_OBJECT(
      'primaryColor', '#8B1E3F', 'secondaryColor', '#D4AF37', 'accentColor', '#FFF8E7',
      'backgroundColor', '#FFFFFF', 'textColor', '#2B2B2B',
      'headingFont', 'Noto Serif Devanagari', 'bodyFont', 'Noto Sans Devanagari'
    ),
    'sections', JSON_ARRAY('personal_info','contact','education','occupation','family','horoscope','about_me','gallery')
  ),
  0, 'published'
FROM template_categories WHERE slug = 'traditional'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO templates (category_id, name, slug, description, config_json, is_premium, status)
SELECT id, 'Modern Elegant', 'modern-elegant',
  'Minimal two-column layout with soft pastel theme and sans-serif typography.',
  JSON_OBJECT(
    'layout', 'two-column',
    'theme', JSON_OBJECT(
      'primaryColor', '#2D6A4F', 'secondaryColor', '#95D5B2', 'accentColor', '#F1FAF6',
      'backgroundColor', '#FFFFFF', 'textColor', '#1B1B1B',
      'headingFont', 'Poppins', 'bodyFont', 'Inter'
    ),
    'sections', JSON_ARRAY('personal_info','contact','education','occupation','family','lifestyle','partner_preferences','about_me','gallery')
  ),
  0, 'published'
FROM template_categories WHERE slug = 'modern'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO templates (category_id, name, slug, description, config_json, is_premium, status)
SELECT id, 'Royal Gold', 'royal-gold',
  'Premium royal theme with gold borders and ornamental section dividers.',
  JSON_OBJECT(
    'layout', 'sidebar',
    'theme', JSON_OBJECT(
      'primaryColor', '#7A1F1F', 'secondaryColor', '#C9A227', 'accentColor', '#FDF6E3',
      'backgroundColor', '#FFFDF7', 'textColor', '#2A1A0A',
      'headingFont', 'Playfair Display', 'bodyFont', 'Lora'
    ),
    'sections', JSON_ARRAY('personal_info','contact','education','occupation','family','horoscope','partner_preferences','about_me','gallery')
  ),
  1, 'published'
FROM template_categories WHERE slug = 'premium'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO templates (category_id, name, slug, description, config_json, is_premium, status)
SELECT id, 'Corporate Clean', 'corporate-clean',
  'Resume-inspired clean layout with a professional gray/blue palette.',
  JSON_OBJECT(
    'layout', 'two-column',
    'theme', JSON_OBJECT(
      'primaryColor', '#1F3A5F', 'secondaryColor', '#5C7A99', 'accentColor', '#EEF2F7',
      'backgroundColor', '#FFFFFF', 'textColor', '#1A1A1A',
      'headingFont', 'Roboto Slab', 'bodyFont', 'Roboto'
    ),
    'sections', JSON_ARRAY('personal_info','contact','education','occupation','family','about_me')
  ),
  0, 'published'
FROM template_categories WHERE slug = 'professional'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO templates (category_id, name, slug, description, config_json, is_premium, status)
SELECT id, 'Large Profile Showcase', 'large-profile-showcase',
  'Photo-centric layout with a large hero profile image at the top.',
  JSON_OBJECT(
    'layout', 'photo-centric',
    'theme', JSON_OBJECT(
      'primaryColor', '#6A4C93', 'secondaryColor', '#C4B7E0', 'accentColor', '#F6F2FB',
      'backgroundColor', '#FFFFFF', 'textColor', '#241E33',
      'headingFont', 'Montserrat', 'bodyFont', 'Nunito Sans'
    ),
    'sections', JSON_ARRAY('personal_info','contact','education','occupation','family','lifestyle','about_me','gallery')
  ),
  0, 'published'
FROM template_categories WHERE slug = 'photo-centric'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO templates (category_id, name, slug, description, config_json, is_premium, status)
SELECT id, 'Wedding Invitation Style', 'wedding-invitation-style',
  'Decorative floral-bordered layout inspired by wedding invitation cards.',
  JSON_OBJECT(
    'layout', 'single-column',
    'theme', JSON_OBJECT(
      'primaryColor', '#A4133C', 'secondaryColor', '#FFB3C6', 'accentColor', '#FFF0F3',
      'backgroundColor', '#FFFBFC', 'textColor', '#3A0CA3',
      'headingFont', 'Great Vibes', 'bodyFont', 'EB Garamond'
    ),
    'sections', JSON_ARRAY('personal_info','contact','education','occupation','family','horoscope','partner_preferences','about_me','gallery')
  ),
  1, 'published'
FROM template_categories WHERE slug = 'wedding-style'
ON DUPLICATE KEY UPDATE name = VALUES(name);
