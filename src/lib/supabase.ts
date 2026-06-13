import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Uploads a file buffer to Supabase Storage and returns the public URL.
 * 
 * @param bucket - The name of the storage bucket
 * @param path - The path/filename to save as
 * @param fileBuffer - The file data
 * @param contentType - The MIME type of the file
 * @returns The public URL of the uploaded file or throws an error
 */
export async function uploadFileToSupabase(
  bucket: string,
  path: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
}

/**
 * Deletes a file from Supabase Storage using its public URL or path.
 * 
 * @param bucket - The name of the storage bucket
 * @param pathOrUrl - The full public URL or the path of the file
 */
export async function deleteFileFromSupabase(
  bucket: string,
  pathOrUrl: string
): Promise<void> {
  if (!pathOrUrl) return;

  // If a full URL is passed, try to extract the file path
  let path = pathOrUrl;
  const urlPrefix = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;
  if (path.startsWith(urlPrefix)) {
    path = path.replace(urlPrefix, '');
  }

  const { error } = await supabase.storage.from(bucket).remove([path]);
  
  if (error) {
    console.error(`Failed to delete file ${path} from Supabase:`, error.message);
  }
}
