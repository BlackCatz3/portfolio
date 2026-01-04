#!/bin/bash

# Deploy rate limit tables to VPS

echo "🚀 Deploying rate limit tables..."

# Create tables
docker exec portfolio-db psql -U postgres -d portfolio_cms_2026 <<EOF
-- Create rate limit settings table
CREATE TABLE IF NOT EXISTS rate_limit_settings (
  id SERIAL PRIMARY KEY,
  max_messages_per_email INTEGER DEFAULT 3,
  time_window_minutes INTEGER DEFAULT 60,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create email rate limit tracking table
CREATE TABLE IF NOT EXISTS email_rate_limits (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  message_count INTEGER DEFAULT 1,
  first_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_rate_limits_email ON email_rate_limits(email);
CREATE INDEX IF NOT EXISTS idx_email_rate_limits_last_message ON email_rate_limits(last_message_at);

-- Insert default settings
INSERT INTO rate_limit_settings (max_messages_per_email, time_window_minutes, enabled)
VALUES (3, 60, true)
ON CONFLICT DO NOTHING;

-- Add comment
COMMENT ON TABLE rate_limit_settings IS 'Settings for email-based rate limiting';
COMMENT ON TABLE email_rate_limits IS 'Tracks message count per email for rate limiting';
EOF

echo "✅ Rate limit tables created successfully!"
echo ""
echo "📊 Verifying tables..."
docker exec portfolio-db psql -U postgres -d portfolio_cms_2026 -c "\dt rate_*"

echo ""
echo "✅ Deployment complete!"
