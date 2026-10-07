-- Seed: 11 supported languages
SET NAMES utf8mb4;

INSERT INTO languages (code, name, native_name, is_rtl, font_family, is_active, sort_order) VALUES
('en', 'English',  'English',   0, 'Noto Sans',          1, 1),
('hi', 'Hindi',     'हिन्दी',     0, 'Noto Sans Devanagari', 1, 2),
('mr', 'Marathi',   'मराठी',      0, 'Noto Sans Devanagari', 1, 3),
('gu', 'Gujarati',  'ગુજરાતી',    0, 'Noto Sans Gujarati', 1, 4),
('pa', 'Punjabi',   'ਪੰਜਾਬੀ',     0, 'Noto Sans Gurmukhi', 1, 5),
('bn', 'Bengali',   'বাংলা',      0, 'Noto Sans Bengali',  1, 6),
('kn', 'Kannada',   'ಕನ್ನಡ',      0, 'Noto Sans Kannada',  1, 7),
('ta', 'Tamil',     'தமிழ்',      0, 'Noto Sans Tamil',    1, 8),
('te', 'Telugu',    'తెలుగు',     0, 'Noto Sans Telugu',   1, 9),
('ml', 'Malayalam', 'മലയാളം',     0, 'Noto Sans Malayalam',1, 10),
('ur', 'Urdu',      'اردو',       1, 'Noto Nastaliq Urdu', 1, 11)
ON DUPLICATE KEY UPDATE name = VALUES(name);
