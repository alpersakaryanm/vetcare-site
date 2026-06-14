import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tbiorpkixwvkphgicdbz.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_jKlULirTA6Hjwo37_xO5BA_6K2V3Xxq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  console.log('Testing upload to vet-uploads...');
  const buffer = Buffer.from('hello world');
  
  const { data, error } = await supabase.storage
    .from('vet-uploads')
    .upload('test-file.txt', buffer, {
      contentType: 'text/plain',
      upsert: true,
    });

  if (error) {
    console.error('Upload Error:', error);
  } else {
    console.log('Upload Success:', data);
  }
}

testUpload();
