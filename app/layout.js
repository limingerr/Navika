import { AppProvider } from "@/script/app-provider";
export const metadata = {
    title: "NAVIKA — Temukan peluangmu",
    description: "Jelajahi peluang beasiswa, magang, dan bootcamp untuk mahasiswa.",
};
export default function RootLayout({ children }) {
    return (<html lang="id">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>);
}
