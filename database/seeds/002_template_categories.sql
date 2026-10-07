-- Seed: template categories
SET NAMES utf8mb4;

INSERT INTO template_categories (name, slug, description, sort_order) VALUES
('Traditional',    'traditional',    'Community-specific traditional biodata styles (Marathi, Hindu, Lingayat, Jain, Brahmin)', 1),
('Modern',         'modern',         'Clean contemporary layouts with elegant, minimal styling', 2),
('Premium',        'premium',        'Royal, golden and luxury themed designs', 3),
('Professional',   'professional',   'Corporate and clean-modern styles suited for working professionals', 4),
('Photo-Centric',  'photo-centric',  'Layouts built around a large profile image', 5),
('Wedding Style',  'wedding-style',  'Decorative wedding-invitation-inspired biodata designs', 6)
ON DUPLICATE KEY UPDATE name = VALUES(name);
