export function resolveAccount(user, role, profile) {
  const isAdmin = role === "pengelola";
  return {
    isAdmin,
    profile: isAdmin ? null : {
      id: user.id,
      name: profile?.name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Mahasiswa",
      email: user.email || "",
      university: profile?.university || "",
      major: profile?.major || "",
      semester: profile?.semester ? String(profile.semester) : "",
      gpa: profile?.gpa ? String(profile.gpa) : "",
      interest: Array.isArray(profile?.interests) ? profile.interests.join(", ") : "",
      emailAlerts: profile?.email_alerts === true,
      deadlineAlerts: profile?.deadline_alerts !== false,
    },
  };
}

/**
 * Validasi domain email saat pendaftaran akun baru.
 * Hanya mengizinkan akun @gmail.com atau domain akademik kampus Indonesia (.ac.id)
 * untuk mencegah penggunaan temporary email (disposable emails).
 */
export function isAllowedRegistrationEmail(email) {
  if (!email || typeof email !== "string") return false;
  const clean = email.trim().toLowerCase();
  const atIndex = clean.lastIndexOf("@");
  if (atIndex === -1) return false;
  const domain = clean.slice(atIndex + 1);
  return domain === "gmail.com" || domain === "ac.id" || domain.endsWith(".ac.id");
}
