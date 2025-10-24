import { createClient } from "@supabase/supabase-js";
import config from "../config/config.js";
import e from "express";

export const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

// ✅ Common upload function
export async function uploadFileToSupabase(
  bucket,
  fileBuffer,
  fileName,
  mimeType
) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: true, // overwrite if file already exists
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading to Supabase:", error.message);
    throw error;
  }
}
