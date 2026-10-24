"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { resolveTheme, translate } from "@/script/i18n";
import { calendarFilters, opportunities as initialOpportunities } from "@/script/opportunities";
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

export function isAdminIdentifier(identifier) {
    if (!identifier) return false;
    const clean = identifier.trim().toLowerCase();
    return clean === "admin" || clean === "adm-navika" || clean.startsWith("adm-") || clean === "admin@navika.id" || clean.startsWith("admin@");
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
        return itemWithDefaults;
    };

    const updateOpportunity = (id, fields) => {
        const updated = opportunities.map((item) => {
            if (item.id === id) {
                return { ...item, ...fields };
            }
            return item;
        });
        saveOpportunitiesState(updated);
    };

    const deleteOpportunity = (id) => {
        const updated = opportunities.filter((item) => item.id !== id);
        saveOpportunitiesState(updated);
    };

    const resetOpportunities = () => {
        setOpportunities(initialOpportunities);
        try {
            localStorage.removeItem(oppsStorageKey);
        } catch {}
    };

    const loginAdmin = (email, password) => {
        setIsAdminLoggedIn(true);
        try {
            localStorage.setItem(adminStorageKey, "true");
        } catch {}
        return true;
    };

    const login = (identifier, password) => {
        if (isAdminIdentifier(identifier)) {
            setIsAdminLoggedIn(true);
            try {
                localStorage.setItem(adminStorageKey, "true");
            } catch {}
            return { role: "admin" };
        } else {
            const studentEmail = identifier.trim();
            const formattedName = profile.name === "Mahasiswa" || profile.name === "Pengguna Demo"
                ? (studentEmail.includes("@") ? studentEmail.split("@")[0].replace(/[._-]/g, " ") : studentEmail)
                : profile.name;
            const updated = {
                ...profile,
                email: studentEmail.includes("@") ? studentEmail : `${studentEmail}@mahasiswa.id`,
                name: formattedName.charAt(0).toUpperCase() + formattedName.slice(1)
            };
            setProfile(updated);
            return { role: "mahasiswa" };
        }
    };

    const logoutAdmin = () => {
        setIsAdminLoggedIn(false);
        try {
            localStorage.removeItem(adminStorageKey);
        } catch {}
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
        setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    };
    const clearDemo = () => {
        setProfile(demoProfile);
        setSaved([]);
        setLocale("id");
        setTheme("light");
        setDeadlineAlerts(true);
        setCalendarFilter("Semua");
        try {
            localStorage.setItem(storageKey, JSON.stringify({ profile: demoProfile, saved: [], locale: "id", theme: "light", deadlineAlerts: true, calendarFilter: "Semua" }));
        }
        catch { }
    };
    return (<AppContext.Provider value={{
      ready,
      profile,
      updateProfile: setProfile,
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
