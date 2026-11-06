import Script from "next/script";
import { AppProvider } from "@/src/components/app-provider";
import { ClarityTracker } from "@/src/components/clarity-tracker";
import "@/style/globals.css";

export const metadata = {
    title: "NAVIKA — Temukan peluangmu",
    description: "Jelajahi peluang beasiswa, magang, dan bootcamp untuk mahasiswa.",
    icons: {
        icon: [
            { url: "/asset/Logo%20Navika.png", type: "image/png" },
            { url: "/favicon.png", type: "image/png" },
        ],
        shortcut: "/asset/Logo%20Navika.png",
        apple: "/asset/Logo%20Navika.png",
    },
};

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-200XEVQNVQ";
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "z6b213a2fj";

export default function RootLayout({ children }) {
    return (<html lang="id">
      <head>
        <link rel="icon" type="image/png" href="/asset/Logo%20Navika.png"/>
        <link rel="shortcut icon" href="/asset/Logo%20Navika.png"/>
        <link rel="apple-touch-icon" href="/asset/Logo%20Navika.png"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <ClarityTracker />
        <AppProvider>{children}</AppProvider>
        {CLARITY_PROJECT_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
              window.clarity("consent");
              window.clarity("upgrade", "page_load");
            `}
          </Script>
        )}
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
        {ONESIGNAL_APP_ID && <><Script
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
                promptOptions: {
                  slidedown: {
                    prompts: [
                      {
                        type: "push",
                        autoPrompt: false,
                        text: {
                          actionMessage: "Dapatkan update beasiswa & pengingat deadline pendaftaran langsung di layarmu.",
                          acceptButton: "Izinkan",
                          cancelButton: "Nanti Saja"
                        }
                      }
                    ]
                  }
                }
              });
            });
          `}
        </Script></>}
      </body>
    </html>);
}
