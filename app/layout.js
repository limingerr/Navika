import { AppProvider } from "@/script/app-provider";
export const metadata = {
    title: "NAVIKA — Temukan peluangmu",
    description: "Jelajahi peluang beasiswa, magang, dan bootcamp untuk mahasiswa.",
};
export default function RootLayout({ children }) {
    return (<html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>);
}
