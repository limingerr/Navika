import { createClient } from "./server";

export async function isAuthorizedAdmin() {
  const supabase = await createClient();
  if (!supabase) return false;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return false;
  const { data: role, error: roleError } = await supabase.from("user_roles")
    .select("role").eq("user_id", data.user.id).maybeSingle();
  return !roleError && role?.role === "pengelola";
}
