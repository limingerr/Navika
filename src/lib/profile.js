export function normalizeGpa(value) {
    const normalized = value.trim().replace(",", ".");
    if (!normalized)
        return "";
    if (!/^\d(?:\.\d{1,2})?$/.test(normalized) || Number(normalized) > 4)
        return null;
    return normalized;
}

export function getProfileDisplayName(profile, isAdminLoggedIn, tr) {
    if (isAdminLoggedIn) {
        return tr ? tr("Pengelola Navika", "Navika Administrator") : "Pengelola Navika";
    }
    const name = profile?.name;
    if (!name || name === "Pengguna Demo" || name === "Mahasiswa") {
        return tr ? tr("Mahasiswa", "Student") : "Mahasiswa";
    }
    return name;
}

export function getProfileInitials(profile, isAdminLoggedIn) {
    if (isAdminLoggedIn) return "AD";
    const name = (profile?.name || "").trim();
    if (!name || name === "Pengguna Demo" || name === "Mahasiswa") return "M";
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
}

export function getProfileRoleLabel(isAdminLoggedIn, tr) {
    if (isAdminLoggedIn) {
        return tr ? tr("Akun Pengelola (Admin)", "Administrator Account") : "Akun Pengelola (Admin)";
    }
    return tr ? tr("Akun Mahasiswa Aktif", "Active Student Account") : "Akun Mahasiswa Aktif";
}

