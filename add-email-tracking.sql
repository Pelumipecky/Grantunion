-- Email tracking and logging table
-- Run this in Supabase SQL Editor

-- Create email_logs table to track all sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idnum INTEGER REFERENCES userlogs(idnum),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  email_type TEXT NOT NULL, -- 'signup', 'investment', 'withdrawal', 'kyc', 'admin', etc.
  mailjet_message_id TEXT,
  status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'opened', 'failed', 'bounced'
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  metadata JSONB, -- Store additional email data
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_email_logs_idnum ON email_logs(idnum);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);

-- Enable RLS
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Allow admins to see all email logs
CREATE POLICY "Admins can view all email logs" ON email_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM userlogs
      WHERE userlogs.admin = true
    )
  );

-- Allow users to see their own email logs
CREATE POLICY "Users can view their own email logs" ON email_logs
  FOR SELECT
  USING (idnum = (SELECT idnum FROM userlogs WHERE email = auth.email()));

-- Allow service role to insert email logs
CREATE POLICY "Service role can insert email logs" ON email_logs
  FOR INSERT
  WITH CHECK (true);

-- Create email_preferences table
CREATE TABLE IF NOT EXISTS email_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idnum INTEGER UNIQUE NOT NULL REFERENCES userlogs(idnum),
  receive_investment_updates BOOLEAN DEFAULT true,
  receive_withdrawal_updates BOOLEAN DEFAULT true,
  receive_kyc_updates BOOLEAN DEFAULT true,
  receive_promotional_emails BOOLEAN DEFAULT true,
  receive_security_alerts BOOLEAN DEFAULT true,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for email preferences
ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own preferences
CREATE POLICY "Users can view their own preferences" ON email_preferences
  FOR SELECT
  USING (idnum = (SELECT idnum FROM userlogs WHERE email = auth.email()));

CREATE POLICY "Users can update their own preferences" ON email_preferences
  FOR UPDATE
  USING (idnum = (SELECT idnum FROM userlogs WHERE email = auth.email()));

-- Create function to auto-create email preferences for new users
CREATE OR REPLACE FUNCTION create_email_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO email_preferences (idnum)
  VALUES (NEW.idnum)
  ON CONFLICT (idnum) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create email preferences
DROP TRIGGER IF EXISTS trigger_create_email_preferences ON userlogs;
CREATE TRIGGER trigger_create_email_preferences
  AFTER INSERT ON userlogs
  FOR EACH ROW
  EXECUTE FUNCTION create_email_preferences();

COMMENT ON TABLE email_logs IS 'Tracks all emails sent through the system';
COMMENT ON TABLE email_preferences IS 'User email notification preferences';
