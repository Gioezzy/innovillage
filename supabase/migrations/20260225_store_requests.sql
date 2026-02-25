-- Create store_requests table
CREATE TABLE IF NOT EXISTS store_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    store_name TEXT NOT NULL,
    store_description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE store_requests ENABLE ROW LEVEL SECURITY;

-- User can insert their own requests
CREATE POLICY "Users can insert their own store requests"
    ON store_requests FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- User can view their own requests
CREATE POLICY "Users can view their own store requests"
    ON store_requests FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Super admin can view all requests
CREATE POLICY "Super admin can view all store requests"
    ON store_requests FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
        )
    );

-- Super admin can update (approve/reject) requests
CREATE POLICY "Super admin can update store requests"
    ON store_requests FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
        )
    );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_store_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER store_requests_updated_at
    BEFORE UPDATE ON store_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_store_requests_updated_at();
