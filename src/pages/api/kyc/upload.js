/**
 * API endpoint for uploading KYC documents
 * This endpoint handles file uploads server-side to avoid RLS issues
 * Uses the service role key for storage uploads
 */

import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with the service role key
// This bypasses RLS restrictions for uploads
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Allow up to 10MB file uploads
    },
  },
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, fileData, bucket, path, userId, fileType } = req.body;

    // Validate inputs
    if (!fileName || !fileData || !bucket || !path || !userId) {
      return res.status(400).json({
        error: 'Missing required fields: fileName, fileData, bucket, path, userId',
      });
    }

    if (!fileData.startsWith('data:')) {
      return res.status(400).json({
        error: 'Invalid file data format - must be base64 data URL',
      });
    }

    // Convert base64 data URL to Buffer
    const base64Data = fileData.split(',')[1];
    if (!base64Data) {
      return res.status(400).json({
        error: 'Invalid base64 data in file',
      });
    }

    const buffer = Buffer.from(base64Data, 'base64');

    // Determine MIME type
    let mimeType = 'application/octet-stream';
    if (fileType) {
      mimeType = fileType;
    } else if (fileName.toLowerCase().endsWith('.png')) {
      mimeType = 'image/png';
    } else if (fileName.toLowerCase().endsWith('.jpg') || fileName.toLowerCase().endsWith('.jpeg')) {
      mimeType = 'image/jpeg';
    } else if (fileName.toLowerCase().endsWith('.pdf')) {
      mimeType = 'application/pdf';
    }

    console.log(`📤 Uploading ${fileName} for user ${userId}`);
    console.log(`   Bucket: ${bucket}, Path: ${path}, Size: ${buffer.length} bytes`);

    // Upload file to Supabase Storage using service role key
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: mimeType,
        upsert: false, // Don't overwrite existing files
      });

    if (error) {
      console.error('❌ Storage upload error:', error);
      return res.status(400).json({
        error: 'Failed to upload file',
        details: error.message,
        code: error.code,
      });
    }

    console.log('✅ File uploaded successfully:', data.path);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return res.status(200).json({
      success: true,
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
      message: `${fileName} uploaded successfully`,
    });
  } catch (err) {
    console.error('❌ KYC upload error:', err);
    return res.status(500).json({
      error: 'Internal server error',
      message: err.message,
    });
  }
}
