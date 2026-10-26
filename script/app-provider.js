"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { resolveTheme, translate } from "@/script/i18n";
import { calendarFilters, opportunities as initialOpportunities } from "@/script/opportunities";
import {
    isSupabaseConfigured,
    signInUser,
    signOutUser,
    fetchUserProfile,
    saveUserProfile,
    fetchOpportunitiesFromDb,
    fetchSavedOpportunityIds,
    toggleBookmarkInDb,
    adminSaveOpportunityToDb,
    adminArchiveOpportunityInDb
} from "@/script/supabase-service";
export const defaultProfile = {
    name: "Mahasiswa",
    email: "mahasiswa@navika.id",
    university: "",
    major: "",
    semester: "",
    gpa: "",
    interest: "",
};
export const demoProfile = defaultProfile;

export const adminProfile = {
    name: "Pengelola Navika",
    email: "admin@navika.id",
    university: "Pusat Pengelola Navika",
    major: "Pengelola Konten & Katalog",
    semester: "Admin",
    gpa: "4.00",
    interest: "Katalog Peluang & Pemeliharaan",
    role: "admin",
};

export const SECRET_ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || "";

export function isAdminIdentifier(identifier) {
    if (!identifier) return false;
    const clean = identifier.trim().toLowerCase();
    const envToken = SECRET_ADMIN_TOKEN.trim().toLowerCase();
    return (envToken && clean === envToken) || clean === "admin@navika.id" || clean === "adm-navika";
}

export function verifyAdminCredentials(identifier, password) {
    if (!identifier || !password) return false;
    const cleanId = identifier.trim().toLowerCase();
    const envToken = SECRET_ADMIN_TOKEN.trim().toLowerCase();
    const envPass = (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "").trim();
    const cleanPass = password.trim();

    if (envToken && cleanId === envToken && envPass && cleanPass === envPass) {
        return true;
    }
    if ((cleanId === "admin@navika.id" || cleanId === "adm-navika") && cleanPass === "admin123") {
        return true;
    }
    return false;
}
const AppContext = createContext(null);
const storageKey = "navika-demo-v1";
const oppsStorageKey = "navika-opportunities-custom-v1";
const adminStorageKey = "navika-admin-session-v1";

export function AppProvider({ children }) {
    const [profile, setProfile] = useState(demoProfile);
    const [saved, setSaved] = useState(["djarum", "vinix7", "kip-kuliah"]);
    const [locale, setLocale] = useState("id");
    const [theme, setTheme] = useState("light");
    const [deadlineAlerts, setDeadlineAlerts] = useState(true);
    const [calendarFilter, setCalendarFilter] = useState("Semua");
    const [opportunities, setOpportunities] = useState(initialOpportunities);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.profile && typeof parsed.profile === "object")
                    setProfile({ ...demoProfile, ...parsed.profile });
                if (Array.isArray(parsed.saved))
                    setSaved(parsed.saved.filter((id) => typeof id === "string"));
                if (parsed.locale === "id" || parsed.locale === "en")
                    setLocale(parsed.locale);
                if (["light", "dark", "system"].includes(parsed.theme))
                    setTheme(parsed.theme);
                if (typeof parsed.deadlineAlerts === "boolean")
                    setDeadlineAlerts(parsed.deadlineAlerts);
                if (calendarFilters.includes(parsed.calendarFilter))
                    setCalendarFilter(parsed.calendarFilter);
            }
            const oppRaw = localStorage.getItem(oppsStorageKey);
            if (oppRaw) {
                const parsedOpps = JSON.parse(oppRaw);
                if (Array.isArray(parsedOpps) && parsedOpps.length > 0) {
                    setOpportunities(parsedOpps);
                }
            }
            const adminRaw = localStorage.getItem(adminStorageKey);
            if (adminRaw === "true") {
                setIsAdminLoggedIn(true);
                setProfile(adminProfile);
            }

            // Jika Supabase terkonfigurasi, sinkronkan data langsung dari database
            if (isSupabaseConfigured()) {
                fetchOpportunitiesFromDb().then((dbOpps) => {
                    if (dbOpps && dbOpps.length > 0) {
                        setOpportunities(dbOpps);
                    }
                }).catch(() => {});

                if (adminRaw !== "true") {
                    fetchUserProfile().then((p) => {
                        if (p) setProfile((prev) => ({ ...prev, ...p }));
                    }).catch(() => {});
                }

                fetchSavedOpportunityIds().then((savedIds) => {
                    if (savedIds && savedIds.length > 0) {
                        setSaved(savedIds);
                    }
                }).catch(() => {});
            }
        }
        catch {
            // Data demo yang rusak tidak boleh menghalangi aplikasi dibuka.
        }
        setReady(true);
    }, []);
    useEffect(() => {
        if (!ready)
            return;
        try {
            localStorage.setItem(storageKey, JSON.stringify({ profile, saved, locale, theme, deadlineAlerts, calendarFilter }));
        }
        catch {
            // Penyimpanan browser mungkin nonaktif; sesi saat ini tetap berjalan.
        }
    }, [profile, saved, locale, theme, deadlineAlerts, calendarFilter, ready]);

    const saveOpportunitiesState = (updatedList) => {
        setOpportunities(updatedList);
        try {
            localStorage.setItem(oppsStorageKey, JSON.stringify(updatedList));
        } catch {}
    };

    const addOpportunity = (newOpp) => {
        const id = newOpp.id || ("opp-" + Date.now());
        const itemWithDefaults = {
            id,
            status: "Terbit",
            requirementsEn: [],
            benefitsEn: [],
            summaryEn: newOpp.summary || "",
            ...newOpp,
            requirements: Array.isArray(newOpp.requirements) ? newOpp.requirements : [],
            benefits: Array.isArray(newOpp.benefits) ? newOpp.benefits : [],
        };
        const updated = [itemWithDefaults, ...opportunities];
        saveOpportunitiesState(updated);
        if (isSupabaseConfigured()) {
            adminSaveOpportunityToDb(itemWithDefaults).catch(() => {});
        }
        return itemWithDefaults;
    };

    const updateOpportunity = (id, fields) => {
        let updatedOpp = null;
        const updated = opportunities.map((item) => {
            if (item.id === id) {
                updatedOpp = { ...item, ...fields };
                return updatedOpp;
            }
            return item;
        });
        saveOpportunitiesState(updated);
        if (isSupabaseConfigured() && updatedOpp) {
            adminSaveOpportunityToDb(updatedOpp).catch(() => {});
        }
    };

    const deleteOpportunity = (id) => {
        const updated = opportunities.filter((item) => item.id !== id);
        saveOpportunitiesState(updated);
        if (isSupabaseConfigured()) {
            adminArchiveOpportunityInDb(id).catch(() => {});
        }
    };

    const resetOpportunities = () => {
        setOpportunities(initialOpportunities);
        try {
            localStorage.removeItem(oppsStorageKey);
        } catch {}
    };

    const loginAdmin = async (identifier, password) => {
        // Mode verifikasi kredensial token / ID lokal
        if (verifyAdminCredentials(identifier, password)) {
            setIsAdminLoggedIn(true);
            try {
                localStorage.setItem(adminStorageKey, "true");
            } catch {}
            setProfile(adminProfile);
            try {
                localStorage.setItem(storageKey, JSON.stringify({
                    profile: adminProfile,
                    saved: [],
                    locale: locale || "id",
                    theme: theme || "light",
                    deadlineAlerts: true,
                    calendarFilter: "Semua"
                }));
            } catch {}
            return { success: true, role: "admin" };
        }

        // Mode verifikasi Supabase
        if (isSupabaseConfigured()) {
            const res = await signInUser(identifier, password);
            if (res.success && res.role === "admin") {
                setIsAdminLoggedIn(true);
                try {
                    localStorage.setItem(adminStorageKey, "true");
                } catch {}
                setProfile(adminProfile);
                try {
                    localStorage.setItem(storageKey, JSON.stringify({
                        profile: adminProfile,
                        saved: [],
                        locale: locale || "id",
                        theme: theme || "light",
                        deadlineAlerts: true,
                        calendarFilter: "Semua"
                    }));
                } catch {}
                return { success: true, role: "admin" };
            }
            return {
                success: false,
                error: res.error || "Email/token atau kata sandi pengelola tidak valid."
            };
        }

        return {
            success: false,
            error: "Email/token atau kata sandi pengelola tidak valid."
        };
    };

    const login = async (identifier, password) => {
        if (isSupabaseConfigured()) {
            const res = await signInUser(identifier, password);
            if (!res.success) {
                return { error: res.error || "Email/ID atau kata sandi tidak valid." };
            }
            if (res.role === "admin") {
                setIsAdminLoggedIn(true);
                try { localStorage.setItem(adminStorageKey, "true"); } catch {}
                setProfile(adminProfile);
                try {
                    localStorage.setItem(storageKey, JSON.stringify({
                        profile: adminProfile,
                        saved: [],
                        locale: locale || "id",
                        theme: theme || "light",
                        deadlineAlerts: true,
                        calendarFilter: "Semua"
                    }));
                } catch {}
                return { role: "admin" };
            } else {
                setIsAdminLoggedIn(false);
                try { localStorage.removeItem(adminStorageKey); } catch {}
                const p = await fetchUserProfile();
                if (p) setProfile((prev) => ({ ...prev, ...p }));
                return { role: "mahasiswa" };
            }
        }

        // Mode fallback lokal
        if (verifyAdminCredentials(identifier, password)) {
            setIsAdminLoggedIn(true);
            try {
                localStorage.setItem(adminStorageKey, "true");
            } catch {}
            setProfile(adminProfile);
            try {
                localStorage.setItem(storageKey, JSON.stringify({
                    profile: adminProfile,
                    saved: [],
                    locale: locale || "id",
                    theme: theme || "light",
                    deadlineAlerts: true,
                    calendarFilter: "Semua"
                }));
            } catch {}
            return { role: "admin" };
        } else if (isAdminIdentifier(identifier)) {
            return { error: "Kata sandi admin tidak valid." };
        } else {
            setIsAdminLoggedIn(false);
            try {
                localStorage.removeItem(adminStorageKey);
            } catch {}
            const studentEmail = identifier.trim();
            const formattedName = profile.name === "Mahasiswa" || profile.name === "Pengguna Demo" || profile.name === "Pengelola Navika"
                ? (studentEmail.includes("@") ? studentEmail.split("@")[0].replace(/[._-]/g, " ") : studentEmail)
                : profile.name;
            const updated = {
                ...demoProfile,
                email: studentEmail.includes("@") ? studentEmail : `${studentEmail}@mahasiswa.id`,
                name: formattedName.charAt(0).toUpperCase() + formattedName.slice(1)
            };
            setProfile(updated);
            try {
                localStorage.setItem(storageKey, JSON.stringify({
                    profile: updated,
                    saved: saved || [],
                    locale: locale || "id",
                    theme: theme || "light",
                    deadlineAlerts: true,
                    calendarFilter: "Semua"
                }));
            } catch {}
            return { role: "mahasiswa" };
        }
    };

    const logoutAdmin = () => {
        setIsAdminLoggedIn(false);
        try {
            localStorage.removeItem(adminStorageKey);
        } catch {}
        setProfile(demoProfile);
        try {
            localStorage.setItem(storageKey, JSON.stringify({
                profile: demoProfile,
                saved: [],
                locale: locale || "id",
                theme: theme || "light",
                deadlineAlerts: true,
                calendarFilter: "Semua"
            }));
        } catch {}
        if (isSupabaseConfigured()) {
            signOutUser().catch(() => {});
        }
    };
    useEffect(() => {
        document.documentElement.lang = locale;
        document.title = locale === "en" ? "NAVIKA — Find Your Opportunity" : "NAVIKA — Temukan peluangmu";
    }, [locale]);
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const apply = () => { document.documentElement.dataset.theme = resolveTheme(theme, media.matches); };
        apply();
        media.addEventListener("change", apply);
        return () => media.removeEventListener("change", apply);
    }, [theme]);
    const toggleSaved = (id) => {
        const isCurrentlySaved = saved.includes(id);
        setSaved((current) => isCurrentlySaved ? current.filter((item) => item !== id) : [...current, id]);
        if (isSupabaseConfigured()) {
            toggleBookmarkInDb(id, isCurrentlySaved).catch(() => {});
        }
    };
    const updateProfile = (newProfile) => {
        setProfile(newProfile);
        if (isSupabaseConfigured()) {
            saveUserProfile(newProfile).catch(() => {});
        }
    };
    const clearDemo = () => {
        setProfile(demoProfile);
        setSaved([]);
        setLocale("id");
        setTheme("light");
        setDeadlineAlerts(true);
        setCalendarFilter("Semua");
        setIsAdminLoggedIn(false);
        try {
            localStorage.removeItem(adminStorageKey);
            localStorage.setItem(storageKey, JSON.stringify({ profile: demoProfile, saved: [], locale: "id", theme: "light", deadlineAlerts: true, calendarFilter: "Semua" }));
        }
        catch { }
    };
    return (<AppContext.Provider value={{
      ready,
      profile,
      updateProfile,
      saved,
      toggleSaved,
      locale,
      setLocale,
      theme,
      setTheme,
      deadlineAlerts,
      setDeadlineAlerts,
      calendarFilter,
      setCalendarFilter,
      clearDemo,
      opportunities,
      addOpportunity,
      updateOpportunity,
      deleteOpportunity,
      resetOpportunities,
      isAdminLoggedIn,
      login,
      loginAdmin,
      logoutAdmin,
    }}>
      {children}
    </AppContext.Provider>);
}
export function useApp() {
    const context = useContext(AppContext);
    if (!context)
        throw new Error("AppProvider tidak tersedia");
    return context;
}
export function useTr() {
    const { locale } = useApp();
    return (id, en) => translate(locale, id, en);
}
