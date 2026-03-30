-- 1. Create Channels Table
CREATE TABLE IF NOT EXISTS canales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL UNIQUE,
    interfaces JSONB DEFAULT '[]'::jsonb, -- Array of objects: { id, api_key, url, url_qr, status }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Seed Initial Channels & Interfaces
INSERT INTO canales (nombre, interfaces) VALUES
('whatsapp', '[
    {"id": "wa-qr", "name": "QR Sync (Legacy)", "api_key": null, "url": null, "url_qr": "https://api.example.com/qr", "status": "active"},
    {"id": "wa-cloud", "name": "Cloud API (Official)", "api_key": "YOUR_KEY", "url": "https://graph.facebook.com", "url_qr": null, "status": "active"}
]'::jsonb),
('telegram', '[
    {"id": "tg-botfather", "name": "Standard Bot", "api_key": "BOT_TOKEN", "url": "https://api.telegram.org", "url_qr": null, "status": "active"}
]'::jsonb),
('facebook', '[
    {"id": "fb-page", "name": "Page Messaging", "api_key": "PAGE_TOKEN", "url": null, "url_qr": null, "status": "active"}
]'::jsonb),
('instagram', '[
    {"id": "ig-dm", "name": "Direct Messenger", "api_key": "ACCESS_TOKEN", "url": null, "url_qr": null, "status": "active"}
]'::jsonb)
ON CONFLICT (nombre) DO UPDATE SET interfaces = EXCLUDED.interfaces;

-- 3. Update Bots Table
-- Add channel_id and interface_id (foreign keys/refs)
ALTER TABLE bots ADD COLUMN IF NOT EXISTS channel_id UUID REFERENCES canales(id);
ALTER TABLE bots ADD COLUMN IF NOT EXISTS interface_id TEXT; -- Matches the "id" inside the interfaces JSONB array

-- 4. Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_canales_updated_at BEFORE UPDATE ON canales FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
