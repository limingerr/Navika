export function resolveAccount(user, role, profile) {
  const isAdmin = role === "pengelola";
  return {
    isAdmin,
    profile: isAdmin ? null : {
      name: profile?.name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Mahasiswa",
      email: user.email || "",
      university: profile?.university || "",
      major: profile?.major || "",
      semester: profile?.semester ? String(profile.semester) : "",
      gpa: profile?.gpa ? String(profile.gpa) : "",
      interest: Array.isArray(profile?.interests) ? profile.interests.join(", ") : "",
    },
  };
}
