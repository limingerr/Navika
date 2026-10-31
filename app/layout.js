import Script from "next/script";
import { AppProvider } from "@/script/app-provider";
import { ClarityTracker } from "@/script/clarity-tracker";
import "@/style/globals.css";

export const metadata = {
    title: "NAVIKA — Temukan peluangmu",
    description: "Jelajahi peluang beasiswa, magang, dan bootcamp untuk mahasiswa.",
};

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "";
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-200XEVQNVQ";

export default function RootLayout({ children }) {
    return (<html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <ClarityTracker />
        <AppProvider>{children}</AppProvider>
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
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

              try {
                if (OneSignal.Slidedown && OneSignal.Slidedown.promptPush) {
                  await OneSignal.Slidedown.promptPush({ force: true });
                } else if (OneSignal.Notifications && OneSignal.Notifications.requestPermission) {
                  await OneSignal.Notifications.requestPermission();
                }
              } catch (e) {
                console.warn("OneSignal auto-prompt notice:", e);
              }
            });
          `}
        </Script>
      </body>
    </html>);
}
