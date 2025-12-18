const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://njsrlykklqqanqqcqklo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qc3JseWtrbHFxYW5xcWNxa2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTM2OTcsImV4cCI6MjA3ODg4OTY5N30.A30trZhFsazi9nzsdaZxKEUNLyOCmRJ49KjjjlUN9rU'
);

async function testConnection() {
  console.log('Testing Supabase connection...');

  // Test basic connection
  const { data, error } = await supabase.from('investments').select('count').limit(1);
  if (error) {
    console.error('Connection error:', error);
    return;
  }

  console.log('Connection successful');

  // Get a pending investment
  const { data: investments, error: investError } = await supabase
    .from('investments')
    .select('*')
    .eq('status', 'Pending')
    .limit(1);

  if (investError) {
    console.error('Error fetching investments:', investError);
    return;
  }

  if (investments.length === 0) {
    console.log('No pending investments found');
    return;
  }

  const investment = investments[0];
  console.log('Found pending investment:', investment);
  console.log('Investment ID type:', typeof investment.id, 'Value:', investment.id);

  // Try to update it
  console.log('Attempting to update investment...');
  const { error: updateError } = await supabase
    .from('investments')
    .update({
      status: 'Active',
      authstatus: 'seen',
      updated_at: new Date().toISOString()
    })
    .eq('id', investment.id);

  if (updateError) {
    console.error('Update error:', updateError);
    console.error('Error code:', updateError.code);
    console.error('Error message:', updateError.message);
  } else {
    console.log('Update successful!');
  }
}

testConnection().catch(console.error);