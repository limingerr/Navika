import Script from "next/script";
import { AppProvider } from "@/script/app-provider";

export const metadata = {
    title: "NAVIKA — Temukan peluangmu",
    description: "Jelajahi peluang beasiswa, magang, dan bootcamp untuk mahasiswa.",
};

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "772b0572-55ce-4a28-aea9-a64695604c0e";

export default function RootLayout({ children }) {
    return (<html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
          defer
        />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            window.OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "${ONESIGNAL_APP_ID}",
                allowLocalhostAsSecureOrigin: true,
              });
            });
          `}
        </Script>
      </body>
    </html>);
}
