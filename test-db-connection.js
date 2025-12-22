#!/usr/bin/env node

/**
 * Database Connection Test
 * Tests Supabase connection and data retrieval
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Database Connection Test');
console.log('============================\n');

// Validate environment variables
console.log('📋 Environment Variables:');
console.log(`  NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ SET' : '❌ NOT SET'}`);
console.log(`  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ SET' : '❌ NOT SET'}`);
console.log(`  SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ SET' : '❌ NOT SET'}\n`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required Supabase credentials!');
  process.exit(1);
}

// Initialize Supabase client
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
  console.log('✅ Supabase client initialized\n');
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error.message);
  process.exit(1);
}

// Test functions
const testUserQuery = async () => {
  console.log('🧪 Testing: Get All Users');
  try {
    const { data, error } = await supabase
      .from('userlogs')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error(`  ❌ Error: ${error.message}`);
      return false;
    }
    
    if (data) {
      console.log(`  ✅ Success! Retrieved ${data.length} users`);
      if (data.length > 0) {
        console.log(`  Sample user: ${data[0].name || data[0].email}`);
      }
      return true;
    }
  } catch (error) {
    console.error(`  ❌ Exception: ${error.message}`);
    return false;
  }
};

const testInvestmentQuery = async () => {
  console.log('\n🧪 Testing: Get All Investments');
  try {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error(`  ❌ Error: ${error.message}`);
      return false;
    }
    
    if (data) {
      console.log(`  ✅ Success! Retrieved ${data.length} investments`);
      return true;
    }
  } catch (error) {
    console.error(`  ❌ Exception: ${error.message}`);
    return false;
  }
};

const testWithdrawalQuery = async () => {
  console.log('\n🧪 Testing: Get All Withdrawals');
  try {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error(`  ❌ Error: ${error.message}`);
      return false;
    }
    
    if (data) {
      console.log(`  ✅ Success! Retrieved ${data.length} withdrawals`);
      return true;
    }
  } catch (error) {
    console.error(`  ❌ Exception: ${error.message}`);
    return false;
  }
};

const testDeletionRequestsQuery = async () => {
  console.log('\n🧪 Testing: Get Deletion Requests');
  try {
    const { data, error } = await supabase
      .from('deletion_requests')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error(`  ❌ Error: ${error.message}`);
      return false;
    }
    
    if (data) {
      console.log(`  ✅ Success! Retrieved ${data.length} deletion requests`);
      return true;
    }
  } catch (error) {
    console.error(`  ❌ Exception: ${error.message}`);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  const results = [];
  
  results.push(await testUserQuery());
  results.push(await testInvestmentQuery());
  results.push(await testWithdrawalQuery());
  results.push(await testDeletionRequestsQuery());
  
  console.log('\n============================');
  console.log('📊 Test Results');
  console.log('============================');
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('✅ All tests passed! Database connection is working.');
    process.exit(0);
  } else {
    console.log(`❌ ${total - passed} test(s) failed. Check database configuration.`);
    process.exit(1);
  }
};

// Execute tests
runTests().catch(error => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});
