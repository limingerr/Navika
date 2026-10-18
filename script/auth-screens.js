"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp, useTr } from "@/script/app-provider";
import { Brand, DemoNote } from "@/script/ui";
function AuthHero({ kind }) {
    const tr = useTr();
    return <div className="auth-hero"><img src={`/asset/asset-ilustrasi-${kind === "login" ? "masuk" : "daftar"}.png`} alt={kind === "login" ? tr("Ilustrasi mahasiswa menggunakan laptop", "Illustration of a student using a laptop") : tr("Ilustrasi mahasiswa membawa buku", "Illustration of a student carrying books")}/></div>;
}
export function LandingScreen() {
    const tr = useTr();
    return <main className="landing page-width"><div className="landing-main"><Brand /><div className="landing-art"><img src="/asset/asset-ilustrasi-belajar.png" alt={tr("Ilustrasi mahasiswa membaca buku", "Illustration of a student reading a book")}/></div><div className="landing-copy"><h1>{tr("Temukan Peluang Impianmu di Sini", "Find Your Next Opportunity Here")}</h1><p>{tr("Jelajahi beasiswa, magang, dan bootcamp yang cocok dengan minat serta jurusanmu.", "Explore scholarships, internships, and bootcamps that suit your interests and major.")}</p><DemoNote /><div className="landing-actions"><Link className="primary-button" href="/daftar">{tr("Daftar", "Sign Up")}</Link><Link className="secondary-button" href="/masuk">{tr("Masuk", "Sign In")}</Link></div></div></div></main>;
}
export function LoginScreen() {
    const router = useRouter();
    const { profile, updateProfile } = useApp();
    const tr = useTr();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
        updateProfile({ ...profile, email });
        setPassword("");
        router.push("/dashboard");
    };
    return <main className="auth-page page-width"><Brand /><div className="auth-layout"><div><AuthHero kind="login"/><div className="auth-intro"><h1>{tr("Temukan peluang yang sesuai untukmu", "Find opportunities that suit you")}</h1><p>{tr("Masuk untuk melanjutkan ke akun demo.", "Sign in to continue to your demo profile.")}</p><DemoNote /></div></div><form className="auth-form" onSubmit={handleSubmit}><label htmlFor="email">Email</label><input id="email" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required/><label htmlFor="password">{tr("Kata Sandi", "Password")}</label><input id="password" type="password" placeholder={tr("Kata sandi demo", "Demo password")} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required/><p className="form-hint">{tr("Form demo menerima kata sandi apa pun dan tidak menyimpannya.", "The demo accepts any password and does not store it.")}</p><button className="primary-button" type="submit">{tr("Masuk ke demo", "Enter Demo")}</button><p className="auth-switch">{tr("Belum punya akun?", "No account yet?")} <Link href="/daftar">{tr("Daftar", "Sign Up")}</Link></p></form></div></main>;
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
    const handleSubmit = (event) => {
        event.preventDefault();
        if (password !== confirm) {
            setError(tr("Konfirmasi kata sandi tidak sama.", "The password confirmation does not match."));
            return;
        }
        updateProfile({ ...profile, name: name.trim(), email });
        setPassword("");
        setConfirm("");
        router.push("/verifikasi");
    };
    return <main className="auth-page page-width"><Brand /><div className="auth-layout"><div><AuthHero kind="register"/><div className="auth-intro"><h1>{tr("Buat akun Navika", "Create a Navika Profile")}</h1><p>{tr("Gratis, hanya butuh satu menit.", "Free and takes just a minute.")}</p><DemoNote /></div></div><form className="auth-form" onSubmit={handleSubmit}><label htmlFor="name">{tr("Nama Lengkap", "Full Name")}</label><input id="name" placeholder={tr("Nama lengkap Anda", "Your full name")} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required/><label htmlFor="email">Email</label><input id="email" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required/><label htmlFor="password">{tr("Kata Sandi", "Password")}</label><input id="password" type="password" minLength={8} placeholder={tr("Minimal 8 karakter", "At least 8 characters")} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required/><label htmlFor="confirm">{tr("Konfirmasi Kata Sandi", "Confirm Password")}</label><input id="confirm" type="password" minLength={8} placeholder={tr("Ulangi kata sandi", "Repeat the password")} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required/>{error && <p className="form-error" role="alert">{error}</p>}<label className="checkbox-label"><input type="checkbox" required/><span>{tr("Saya memahami bahwa ini adalah demo tanpa pembuatan akun nyata.", "I understand this is a demo and does not create a real account.")}</span></label><button className="primary-button" type="submit">{tr("Daftar demo", "Create Demo Profile")}</button><p className="auth-switch">{tr("Sudah punya akun?", "Already have an account?")} <Link href="/masuk">{tr("Masuk", "Sign In")}</Link></p></form></div></main>;
}
export function VerificationScreen() {
    const { profile } = useApp();
    const tr = useTr();
    return <main className="verify-page page-width"><Brand /><div className="verify-content"><img src="/asset/verifikasi.png" alt=""/><h1>{tr("Profil demo siap digunakan", "Your Demo Profile Is Ready")}</h1><p>{tr("Selamat datang", "Welcome")}{profile.name === "Pengguna Demo" ? "" : `, ${profile.name}`}! {tr("Lanjutkan untuk menjelajahi peluang.", "Continue to explore opportunities.")}</p><p className="info-box">{tr("Tidak ada email verifikasi yang dikirim dalam mode demo.", "No verification email is sent in demo mode.")}</p><Link className="primary-button" href="/dashboard">{tr("Lanjut ke Dashboard", "Continue to Dashboard")}</Link></div></main>;
}
