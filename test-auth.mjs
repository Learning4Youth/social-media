import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbfygrskxsvlcmvvolgu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiZnlncnNreHN2bGNtdnZvbGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwOTczMTksImV4cCI6MjA3NDY3MzMxOX0.E20J6GwHWDmvD52U8tUobJwPZTt07GMAH5kpofixs3g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  console.log('🔐 Testing login...\n');
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'ates@learningforyouth.com',
    password: 'Diluna1335_',
  });
  
  if (error) {
    console.error('❌ Login failed!');
    console.error('Error:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
  } else {
    console.log('✅ Login successful!');
    console.log('User:', data.user.email);
    console.log('Session:', data.session ? 'Valid' : 'None');
    console.log('Access Token:', data.session?.access_token?.substring(0, 20) + '...');
  }
}

testLogin();