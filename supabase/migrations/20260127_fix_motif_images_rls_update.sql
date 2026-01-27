-- Fix RLS 2: Allow authenticated users to UPDATE their own scan results
-- Required because smart-lens.ts performs an INSERT followed by an UPDATE after AI processing.

CREATE POLICY "Users can update own motif images"
ON public.motif_images
FOR UPDATE
TO authenticated
USING (
  auth.uid() = uploaded_by
)
WITH CHECK (
  auth.uid() = uploaded_by
);
