import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to upload file to Supabase Storage
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
): Promise<{ path: string; error: Error | null }> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`
    const filePath = `${path}/${fileName}`

    const { error } = await supabase.storage.from(bucket).upload(filePath, file)

    if (error) throw error

    return { path: filePath, error: null }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { path: "", error: error as Error }
  }
}

// Helper function to get public URL for a file
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  return data.publicUrl
}

