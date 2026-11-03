export function withOneSignal(callback) {
  if (typeof window === "undefined") return Promise.reject(new Error("Browser tidak tersedia."));
  if (!process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) return Promise.reject(new Error("Web Push belum dikonfigurasi."));
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  return new Promise((resolve, reject) => {
    let active = true;
    const timeout = window.setTimeout(() => {
      active = false;
      reject(new Error("OneSignal tidak dapat dimuat. Muat ulang halaman dan coba lagi."));
    }, 10000);
    window.OneSignalDeferred.push(async (OneSignal) => {
      if (!active) return;
      window.clearTimeout(timeout);
      try {
        resolve(await callback(OneSignal));
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function verifyServerSubscription(subscriptionId) {
  const response = await fetch("/api/notify/push-subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscriptionId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Langganan Web Push tidak dapat diperiksa.");
  return data.registered === true;
}

export async function getWebPushStatus(userId) {
  return withOneSignal(async (OneSignal) => {
    if (userId) await OneSignal.login(userId);
    const subscriptionId = OneSignal.User.PushSubscription.id;
    const localSubscribed = Boolean(OneSignal.Notifications.permission && OneSignal.User.PushSubscription.optedIn && subscriptionId);
    return {
      supported: Boolean(OneSignal.Notifications.isPushSupported()),
      permission: typeof Notification === "undefined" ? "unsupported" : Notification.permission,
      subscribed: localSubscribed && await verifyServerSubscription(subscriptionId),
      localSubscribed,
    };
  });
}

export async function enableWebPush(userId) {
  return withOneSignal(async (OneSignal) => {
    if (!OneSignal.Notifications.isPushSupported()) throw new Error("Browser ini tidak mendukung Web Push.");
    if (Notification.permission === "denied") throw new Error("Izin notifikasi diblokir. Izinkan notifikasi untuk situs ini melalui pengaturan browser, lalu coba lagi.");
    if (!OneSignal.Notifications.permission) await OneSignal.Slidedown.promptPush({ force: true });
    if (userId) await OneSignal.login(userId);
    if (OneSignal.Notifications.permission && !OneSignal.User.PushSubscription.optedIn) await OneSignal.User.PushSubscription.optIn();
    let subscribed = Boolean(OneSignal.Notifications.permission && OneSignal.User.PushSubscription.optedIn && OneSignal.User.PushSubscription.id);
    for (let attempt = 0; !subscribed && attempt < 100; attempt++) {
      if (Notification.permission === "denied") break;
      await new Promise((resolve) => setTimeout(resolve, 300));
      subscribed = Boolean(OneSignal.Notifications.permission && OneSignal.User.PushSubscription.optedIn && OneSignal.User.PushSubscription.id);
    }
    if (!subscribed) throw new Error("Perangkat belum berlangganan Web Push. Pastikan izin notifikasi browser diberikan, lalu coba lagi.");
    if (!await verifyServerSubscription(OneSignal.User.PushSubscription.id)) {
      throw new Error("Langganan browser tidak ditemukan pada aplikasi OneSignal pengirim. Periksa konfigurasi OneSignal.");
    }
    return true;
  });
}
