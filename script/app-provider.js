"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { resolveTheme, translate } from "@/script/i18n";
export const demoProfile = {
    name: "Pengguna Demo",
    email: "demo@navika.local",
    university: "",
    major: "",
    semester: "",
    gpa: "",
    interest: "",
};
const AppContext = createContext(null);
const storageKey = "navika-demo-v1";
export function AppProvider({ children }) {
    const [profile, setProfile] = useState(demoProfile);
    const [saved, setSaved] = useState(["djarum", "vinix7", "kip-kuliah"]);
    const [locale, setLocale] = useState("id");
    const [theme, setTheme] = useState("light");
    const [deadlineAlerts, setDeadlineAlerts] = useState(true);
    const [calendarFilter, setCalendarFilter] = useState("Semua");
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
                if (["Semua", "Beasiswa", "Deadline", "Bootcamp", "Disimpan", "Magang", "Rekomendasi"].includes(parsed.calendarFilter))
                    setCalendarFilter(parsed.calendarFilter);
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
    return (<AppContext.Provider value={{ ready, profile, updateProfile: setProfile, saved, toggleSaved, locale, setLocale, theme, setTheme, deadlineAlerts, setDeadlineAlerts, calendarFilter, setCalendarFilter, clearDemo }}>
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
