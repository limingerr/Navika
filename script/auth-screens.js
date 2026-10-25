"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp, useTr } from "@/script/app-provider";
import { Brand, DemoNote } from "@/script/ui";
import { isSupabaseConfigured, signUpUser } from "@/script/supabase-service";
function AuthHero({ kind }) {
    const tr = useTr();
    return <div className="auth-hero"><img src={`/asset/asset-ilustrasi-${kind === "login" ? "masuk" : "daftar"}.png`} alt={kind === "login" ? tr("Ilustrasi mahasiswa menggunakan laptop", "Illustration of a student using a laptop") : tr("Ilustrasi mahasiswa membawa buku", "Illustration of a student carrying books")}/></div>;
}
function GoogleAuthLink({ action }) {
    const tr = useTr();
    const [failed, setFailed] = useState(false);
    useEffect(() => {
        setFailed(new URLSearchParams(window.location.search).get("oauth") === "failed");
    }, []);
    const available = process.env.NEXT_PUBLIC_SUPABASE_URL &&
        (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    if (!available) return null;
    return <div className="google-auth"><p className="google-auth-divider">{tr("atau", "or")}</p><a className="google-auth-link" href="/auth/google"><img src="/asset/google-icon.svg" alt="" width="20" height="20"/>{action === "login" ? tr("Masuk dengan Google", "Sign in with Google") : tr("Daftar dengan Google", "Sign up with Google")}</a>{action === "login" && failed && <p className="form-error" role="alert">{tr("Login Google gagal atau dibatalkan. Coba lagi.", "Google sign-in failed or was cancelled. Try again.")}</p>}</div>;
}
export function LandingScreen() {
    const tr = useTr();
    return <main className="landing page-width"><div className="landing-main"><Brand /><div className="landing-art"><img src="/asset/asset-ilustrasi-belajar.png" alt={tr("Ilustrasi mahasiswa membaca buku", "Illustration of a student reading a book")}/></div><div className="landing-copy"><h1>{tr("Temukan Peluang Impianmu di Sini", "Find Your Next Opportunity Here")}</h1><p>{tr("Jelajahi beasiswa, magang, dan bootcamp yang cocok dengan minat serta jurusanmu.", "Explore scholarships, internships, and bootcamps that suit your interests and major.")}</p><DemoNote /><div className="landing-actions"><Link className="primary-button" href="/daftar">{tr("Daftar", "Sign Up")}</Link><Link className="secondary-button" href="/masuk">{tr("Masuk", "Sign In")}</Link></div></div></div></main>;
}
export function LoginScreen() {
    const router = useRouter();
    const { login } = useApp();
    const tr = useTr();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!identifier.trim() || !password.trim()) {
            setError(tr("Silakan isi email/ID dan kata sandi.", "Please enter your email/ID and password."));
            return;
        }
        const result = await login(identifier, password);
        if (result?.error) {
            setError(result.error);
            return;
        }
        setPassword("");
        if (result?.role === "admin") {
            router.push("/admin");
        } else {
            router.push("/dashboard");
        }
    };
    return <main className="auth-page page-width"><Brand /><div className="auth-layout"><div><AuthHero kind="login"/><div className="auth-intro"><h1>{tr("Temukan peluang yang sesuai untukmu", "Find opportunities that suit you")}</h1><p>{tr("Masuk untuk melanjutkan ke akun NAVIKA.", "Sign in to continue to your NAVIKA account.")}</p><DemoNote /></div></div><div className="auth-controls"><form className="auth-form" onSubmit={handleSubmit}><label htmlFor="identifier">{tr("Email", "Email")}</label><input id="identifier" type="text" placeholder="nama@email.com" value={identifier} onChange={(e) => { setIdentifier(e.target.value); setError(""); }} autoComplete="username" required/><label htmlFor="password">{tr("Kata Sandi", "Password")}</label><input id="password" type="password" placeholder={tr("Masukkan kata sandi", "Enter password")} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} autoComplete="current-password" required/>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-button" type="submit">{tr("Masuk", "Sign In")}</button></form><GoogleAuthLink action="login"/><p className="auth-switch">{tr("Belum punya akun?", "No account yet?")} <Link href="/daftar">{tr("Daftar", "Sign Up")}</Link></p></div></div></main>;
}
export function RegisterScreen() {
    const router = useRouter();
    const { profile, updateProfile } = useApp();
    const tr = useTr();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirm) {
            setError(tr("Konfirmasi kata sandi tidak sama.", "The password confirmation does not match."));
            return;
        }
        if (isSupabaseConfigured()) {
            const res = await signUpUser(name, email, password);
            if (!res.success) {
                setError(res.error || "Pendaftaran gagal. Silakan periksa kembali data Anda.");
                return;
            }
        }
        updateProfile({ ...profile, name: name.trim(), email });
        setPassword("");
        setConfirm("");
        router.push("/verifikasi");
    };
    return <main className="auth-page page-width"><Brand /><div className="auth-layout"><div><AuthHero kind="register"/><div className="auth-intro"><h1>{tr("Buat akun NAVIKA", "Create a NAVIKA Profile")}</h1><p>{tr("Gratis, hanya butuh satu menit.", "Free and takes just a minute.")}</p><DemoNote /></div></div><div className="auth-controls"><form className="auth-form" onSubmit={handleSubmit}><label htmlFor="name">{tr("Nama Lengkap", "Full Name")}</label><input id="name" placeholder={tr("Nama lengkap Anda", "Your full name")} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required/><label htmlFor="email">Email</label><input id="email" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required/><label htmlFor="password">{tr("Kata Sandi", "Password")}</label><input id="password" type="password" minLength={8} placeholder={tr("Minimal 8 karakter", "At least 8 characters")} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required/><label htmlFor="confirm">{tr("Konfirmasi Kata Sandi", "Confirm Password")}</label><input id="confirm" type="password" minLength={8} placeholder={tr("Ulangi kata sandi", "Repeat the password")} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required/>{error && <p className="form-error" role="alert">{error}</p>}<label className="checkbox-label"><input type="checkbox" required/><span>{tr("Saya menyetujui syarat & ketentuan layanan NAVIKA.", "I agree to the NAVIKA terms of service.")}</span></label><button className="primary-button" type="submit">{tr("Daftar Sekarang", "Create Profile")}</button></form><GoogleAuthLink action="signup"/><p className="auth-switch">{tr("Sudah punya akun?", "Already have an account?")} <Link href="/masuk">{tr("Masuk", "Sign In")}</Link></p></div></div></main>;
}
export function VerificationScreen() {
    const { profile } = useApp();
    const tr = useTr();
    const userName = profile.name && profile.name !== "Pengguna Demo" && profile.name !== "Mahasiswa" ? profile.name : "";
    return <main className="verify-page page-width"><Brand /><div className="verify-content"><img src="/asset/verifikasi.png" alt=""/><h1>{tr("Akun Siap Digunakan", "Your Profile Is Ready")}</h1><p>{tr("Selamat datang", "Welcome")}{userName ? `, ${userName}` : ""}! {tr("Lanjutkan untuk menjelajahi peluang.", "Continue to explore opportunities.")}</p><p className="info-box">{tr("Akun Anda telah aktif dan terverifikasi secara resmi.", "Your account is active and verified.")}</p><Link className="primary-button" href="/dashboard">{tr("Lanjut ke Beranda", "Continue to Dashboard")}</Link></div></main>;
}
