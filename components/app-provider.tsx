"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Locale, Theme, resolveTheme, translate } from "@/lib/i18n";
import { CalendarFilter } from "@/lib/opportunities";

export type Profile = {
  name: string;
  email: string;
  university: string;
  major: string;
  semester: string;
  gpa: string;
  interest: string;
};

export const demoProfile: Profile = {
  name: "Pengguna Demo",
  email: "demo@navika.local",
  university: "",
  major: "",
  semester: "",
  gpa: "",
  interest: "",
};

type AppContextValue = {
  ready: boolean;
  profile: Profile;
  updateProfile: (profile: Profile) => void;
  saved: string[];
  toggleSaved: (id: string) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  deadlineAlerts: boolean;
  setDeadlineAlerts: (enabled: boolean) => void;
  calendarFilter: CalendarFilter;
  setCalendarFilter: (filter: CalendarFilter) => void;
  clearDemo: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);
const storageKey = "navika-demo-v1";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(demoProfile);
  const [saved, setSaved] = useState<string[]>(["djarum", "vinix7", "kip-kuliah"]);
  const [locale, setLocale] = useState<Locale>("id");
  const [theme, setTheme] = useState<Theme>("light");
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [calendarFilter, setCalendarFilter] = useState<CalendarFilter>("Semua");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.profile && typeof parsed.profile === "object") setProfile({ ...demoProfile, ...parsed.profile });
        if (Array.isArray(parsed.saved)) setSaved(parsed.saved.filter((id: unknown) => typeof id === "string"));
        if (parsed.locale === "id" || parsed.locale === "en") setLocale(parsed.locale);
        if (["light", "dark", "system"].includes(parsed.theme)) setTheme(parsed.theme);
        if (typeof parsed.deadlineAlerts === "boolean") setDeadlineAlerts(parsed.deadlineAlerts);
        if (["Semua", "Beasiswa", "Deadline", "Bootcamp", "Disimpan", "Magang", "Rekomendasi"].includes(parsed.calendarFilter)) setCalendarFilter(parsed.calendarFilter);
      }
    } catch {
      // A damaged demo record should not prevent the app from opening.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ profile, saved, locale, theme, deadlineAlerts, calendarFilter }));
    } catch {
      // Browser storage can be disabled; the current session still works.
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

  const toggleSaved = (id: string) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const clearDemo = () => {
    setProfile(demoProfile);
    setSaved([]);
    setLocale("id");
    setTheme("light");
    setDeadlineAlerts(true);
    setCalendarFilter("Semua");
    try { localStorage.setItem(storageKey, JSON.stringify({ profile: demoProfile, saved: [], locale: "id", theme: "light", deadlineAlerts: true, calendarFilter: "Semua" })); } catch {}
  };

  return (
    <AppContext.Provider value={{ ready, profile, updateProfile: setProfile, saved, toggleSaved, locale, setLocale, theme, setTheme, deadlineAlerts, setDeadlineAlerts, calendarFilter, setCalendarFilter, clearDemo }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("AppProvider tidak tersedia");
  return context;
}

export function useTr() {
  const { locale } = useApp();
  return (id: string, en: string) => translate(locale, id, en);
}
