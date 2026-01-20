// Quick test to see if getUserByIdnum works
import { supabaseDb } from './src/database/supabaseUtils.js';

async function testUserLookup() {
  try {
    console.log('Testing getUserByIdnum...');
    
    // Test with a sample idnum
    const testIdnum = 'USER12345'; // Change this to a real user idnum from your database
    
    const result = await supabaseDb.getUserByIdnum(testIdnum);
    console.log('Result:', result);
    
    if (result.data) {
      console.log('User found:');
      console.log('- Email:', result.data.email);
      console.log('- Name:', result.data.name);
      console.log('- All keys:', Object.keys(result.data));
    } else {
      console.log('No user found');
    }
    
    if (result.error) {
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testUserLookup();
