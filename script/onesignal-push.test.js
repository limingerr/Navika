import test from "node:test";
import assert from "node:assert/strict";
import { enableWebPush, getWebPushStatus } from "./onesignal-push.js";

test("status Web Push memerlukan izin, opt-in, dan ID langganan", async () => {
  const previous = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID = "test-app";
  globalThis.window = { OneSignalDeferred: { push: (callback) => callback({
    Notifications: { isPushSupported: () => true, permission: true },
    User: { PushSubscription: { optedIn: true, id: null } },
  }) }, setTimeout, clearTimeout };
  globalThis.Notification = { permission: "granted" };
  try {
    assert.equal((await getWebPushStatus()).subscribed, false);
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    else process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID = previous;
    delete globalThis.window;
    delete globalThis.Notification;
  }
});

test("izin browser yang diblokir menghentikan aktivasi Web Push", async () => {
  const previous = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID = "test-app";
  globalThis.window = { OneSignalDeferred: { push: (callback) => callback({
    Notifications: { isPushSupported: () => true },
  }) }, setTimeout, clearTimeout };
  globalThis.Notification = { permission: "denied" };
  try {
    await assert.rejects(enableWebPush("student-id"), /Izin notifikasi diblokir/);
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    else process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID = previous;
    delete globalThis.window;
    delete globalThis.Notification;
  }
});

test("status aktif memerlukan langganan yang ditemukan aplikasi OneSignal pengirim", async () => {
  const previous = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const previousFetch = globalThis.fetch;
  process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID = "test-app";
  globalThis.window = { OneSignalDeferred: { push: (callback) => callback({
    Notifications: { isPushSupported: () => true, permission: true },
    User: { PushSubscription: { optedIn: true, id: "subscription-id" } },
  }) }, setTimeout, clearTimeout };
  globalThis.Notification = { permission: "granted" };
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ registered: false }) });
  try {
    const status = await getWebPushStatus();
    assert.equal(status.localSubscribed, true);
    assert.equal(status.subscribed, false);
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ registered: true }) });
    assert.equal((await getWebPushStatus()).subscribed, true);
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    else process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID = previous;
    globalThis.fetch = previousFetch;
    delete globalThis.window;
    delete globalThis.Notification;
  }
});
