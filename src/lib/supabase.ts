import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

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
 * @param skipOptimization - If true, skips sharp image compression
 * @returns The public URL of the uploaded file or throws an error
 */
export async function uploadFileToSupabase(
  bucket: string,
  path: string,
  fileBuffer: Buffer,
  contentType: string,
  skipOptimization: boolean = false
): Promise<string> {
  let finalBuffer = fileBuffer;
  let finalContentType = contentType;
  let finalPath = path;

  // Optimizasyon
  if (!skipOptimization && contentType.startsWith('image/') && contentType !== 'image/svg+xml') {
    try {
      finalBuffer = await sharp(fileBuffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 40 })
        .toBuffer();
      
      finalContentType = 'image/webp';
      
      const lastDotIndex = finalPath.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        finalPath = finalPath.substring(0, lastDotIndex) + '.webp';
      } else {
        finalPath = finalPath + '.webp';
      }
    } catch (err) {
      console.error("Görsel optimizasyon hatası:", err);
    }
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(finalPath, finalBuffer, {
      contentType: finalContentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(finalPath);

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
