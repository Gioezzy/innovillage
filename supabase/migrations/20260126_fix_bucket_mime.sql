-- Update the 'uploads' bucket to allow image types
-- This fixes the "mime type image/jpeg is not supported" error

UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/jpg', 'image/gif']
WHERE id = 'uploads';

-- Ensure it's public as well (for good measure)
UPDATE storage.buckets
SET public = true
WHERE id = 'uploads';
