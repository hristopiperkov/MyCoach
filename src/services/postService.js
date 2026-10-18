import supabase from "../supabase";

const fields = "id,title,content,image_url,created_at,author_id,author:users!posts_author_id_fkey(first_name,last_name,img_url,role)";

export async function getPost(id, signal) {
  if (!supabase) throw new Error("Supabase is not configured.");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
  const { data, error } = await supabase.from("posts").select(fields).eq("id", id).abortSignal(signal).maybeSingle();
  if (error) throw error;
  return data;
}

export function validatePost({ title, content, image_url }) {
  const values = { title: title.trim(), content: content.trim(), image_url: image_url.trim() || null };
  if (values.title.length < 3 || values.title.length > 120) throw new Error("Title must contain between 3 and 120 characters.");
  if (values.content.length < 10 || values.content.length > 10000) throw new Error("Content must contain between 10 and 10,000 characters.");
  if (values.image_url) {
    try {
      if (!['http:', 'https:'].includes(new URL(values.image_url).protocol) || /\s/.test(values.image_url)) throw new Error();
    } catch { throw new Error("Enter a valid image URL starting with http:// or https://."); }
  }
  return values;
}

export async function updatePost(id, authorId, values) {
  const { data, error } = await supabase.from("posts").update(values)
    .eq("id", id).eq("author_id", authorId).select("id").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("The post no longer exists or you cannot edit it.");
  return data;
}

export async function deletePost(id, authorId) {
  const { data, error } = await supabase.from("posts").delete()
    .eq("id", id).eq("author_id", authorId).select("id");
  if (error) throw error;
  if (!data?.length) throw new Error("The post no longer exists or you cannot delete it.");
}
