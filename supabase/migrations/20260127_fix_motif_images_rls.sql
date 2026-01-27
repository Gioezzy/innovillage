-- Fix RLS: Allow authenticated users to insert their own scan results
-- Currently only Super Admins can insert, causing 42501 error for regular users.

CREATE POLICY "Users can insert own motif images"
ON public.motif_images
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = uploaded_by
);

-- Also ensure they can see their own images (already covered by public select, but good to be explicit for privacy if mixed)
-- (The existing "Public can view motif images" covers SELECT, so we just need INSERT)
