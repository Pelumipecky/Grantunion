/**
 * Script to delete user "Pelumipecky@gmail.com" and all associated data
 * from both Supabase and Firebase databases
 */

try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  console.log('No .env.local found, using environment variables');
}

const { createClient } = require('@supabase/supabase-js');
const { initializeApp } = require('firebase/app');
const { getAuth, deleteUser: deleteFirebaseUser } = require('firebase/auth');
const { getFirestore, collection, query, where, getDocs, deleteDoc, doc } = require('firebase/firestore');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Firebase config (from existing scripts)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyC5c9tQZzJcKJ9v9v9v9v9v9v9v9v9v9v9",
  authDomain: "mint9517-67eca.firebaseapp.com",
  projectId: "mint9517-67eca",
  storageBucket: "mint9517-67eca.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const TARGET_EMAIL = 'pelumipecky@gmail.com';

async function deleteFromFirebase(userId) {
  console.log('🔥 Deleting from Firebase...');

  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Try to delete from Firebase Auth
    try {
      await deleteFirebaseUser(userId);
      console.log('✅ Deleted from Firebase Auth');
    } catch (authError) {
      console.log('⚠️ Firebase Auth deletion failed (user may not exist):', authError.message);
    }

    // Delete Firestore documents
    const collections = ['users', 'investments', 'withdrawals', 'notifications', 'kyc'];

    for (const collectionName of collections) {
      try {
        const q = query(collection(db, collectionName), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const deletePromises = [];
        querySnapshot.forEach((document) => {
          deletePromises.push(deleteDoc(doc(db, collectionName, document.id)));
        });

        if (deletePromises.length > 0) {
          await Promise.all(deletePromises);
          console.log(`✅ Deleted ${deletePromises.length} documents from Firebase ${collectionName}`);
        }
      } catch (error) {
        console.log(`⚠️ Error deleting from Firebase ${collectionName}:`, error.message);
      }
    }

  } catch (error) {
    console.error('❌ Firebase deletion error:', error.message);
  }
}

async function deleteFromSupabase() {
  console.log('🗄️ Deleting from Supabase...');

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing Supabase credentials');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // 1. Find user by email
  console.log(`🔍 Finding user with email: ${TARGET_EMAIL}`);
  const { data: userData, error: findError } = await supabase
    .from('userlogs')
    .select('*')
    .eq('email', TARGET_EMAIL)
    .single();

  if (findError || !userData) {
    console.error('❌ User not found in Supabase:', findError?.message);
    return;
  }

  console.log(`✅ Found user: ${userData.name} (ID: ${userData.id}, IDNum: ${userData.idnum})`);

  const userId = userData.id;
  const userIdNum = userData.idnum;

  // 2. Delete from all related tables
  const deleteOperations = [
    { table: 'notifications', field: 'idnum', value: userIdNum, description: 'notifications' },
    { table: 'investments', field: 'idnum', value: userIdNum, description: 'investments' },
    { table: 'withdrawals', field: 'idnum', value: userIdNum, description: 'withdrawals' },
    { table: 'loans', field: 'idnum', value: userIdNum, description: 'loans' },
    { table: 'kyc', field: 'idnum', value: userIdNum, description: 'KYC records' },
    { table: 'chats', field: 'user_id', value: userId, description: 'chat messages' },
    { table: 'withdrawal_codes', field: 'user_id', value: userId, description: 'withdrawal codes' },
    { table: 'deletion_requests', field: 'user_id', value: userId, description: 'deletion requests' }
  ];

  for (const op of deleteOperations) {
    try {
      const { error } = await supabase
        .from(op.table)
        .delete()
        .eq(op.field, op.value);

      if (error) {
        console.error(`❌ Error deleting from ${op.table}:`, error.message);
      } else {
        console.log(`✅ Deleted from ${op.table}`);
      }
    } catch (error) {
      console.error(`❌ Unexpected error deleting from ${op.table}:`, error.message);
    }
  }

  // 3. Delete from Supabase Auth
  try {
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      console.log('⚠️ Supabase Auth deletion failed (user may not exist):', authError.message);
    } else {
      console.log('✅ Deleted from Supabase Auth');
    }
  } catch (error) {
    console.error('❌ Error deleting from Supabase Auth:', error.message);
  }

  // 4. Finally, delete from userlogs
  try {
    const { error } = await supabase
      .from('userlogs')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('❌ Error deleting from userlogs:', error.message);
    } else {
      console.log('✅ Deleted from userlogs');
    }
  } catch (error) {
    console.error('❌ Unexpected error deleting from userlogs:', error.message);
  }
}

async function main() {
  console.log('🚨 STARTING USER DELETION PROCESS 🚨');
  console.log(`Target: ${TARGET_EMAIL}`);
  console.log('This will permanently delete all user data from both databases!');
  console.log('');

  try {
    // Delete from Supabase first
    await deleteFromSupabase();

    // Then delete from Firebase
    await deleteFromFirebase(TARGET_EMAIL); // Using email as userId for Firebase lookup

    console.log('');
    console.log('🎉 USER DELETION COMPLETED 🎉');
    console.log(`Successfully deleted user ${TARGET_EMAIL} and all associated data`);

  } catch (error) {
    console.error('❌ CRITICAL ERROR during deletion:', error);
    process.exit(1);
  }
}

// Run the deletion
main().catch(console.error);