import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tbiorpkixwvkphgicdbz.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_jKlULirTA6Hjwo37_xO5BA_6K2V3Xxq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBucket() {
  const { data, error } = await supabase.storage.getBucket('vet-uploads');
  if (error) {
    console.error('Bucket error:', error);
    
    console.log('Trying to create bucket...');
    const createRes = await supabase.storage.createBucket('vet-uploads', { public: true });
    console.log('Create result:', createRes);
  } else {
    console.log('Bucket exists:', data);
  }
}

checkBucket();
