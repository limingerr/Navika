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

export async function getWebPushStatus() {
  return withOneSignal((OneSignal) => ({
    supported: Boolean(OneSignal.Notifications.isPushSupported()),
    permission: typeof Notification === "undefined" ? "unsupported" : Notification.permission,
    subscribed: Boolean(OneSignal.Notifications.permission && OneSignal.User.PushSubscription.optedIn && OneSignal.User.PushSubscription.id),
  }));
}

export async function enableWebPush(userId) {
  return withOneSignal(async (OneSignal) => {
    if (!OneSignal.Notifications.isPushSupported()) throw new Error("Browser ini tidak mendukung Web Push.");
    if (Notification.permission === "denied") throw new Error("Izin notifikasi diblokir. Izinkan notifikasi untuk situs ini melalui pengaturan browser, lalu coba lagi.");
    if (userId) await OneSignal.login(userId);
    if (!OneSignal.Notifications.permission) await OneSignal.Slidedown.promptPush({ force: true });
    if (OneSignal.Notifications.permission && !OneSignal.User.PushSubscription.optedIn) await OneSignal.User.PushSubscription.optIn();
    let subscribed = Boolean(OneSignal.Notifications.permission && OneSignal.User.PushSubscription.optedIn && OneSignal.User.PushSubscription.id);
    for (let attempt = 0; !subscribed && attempt < 100; attempt++) {
      if (Notification.permission === "denied") break;
      await new Promise((resolve) => setTimeout(resolve, 300));
      subscribed = Boolean(OneSignal.Notifications.permission && OneSignal.User.PushSubscription.optedIn && OneSignal.User.PushSubscription.id);
    }
    if (!subscribed) throw new Error("Perangkat belum berlangganan Web Push. Pastikan izin notifikasi browser diberikan, lalu coba lagi.");
    return true;
  });
}
