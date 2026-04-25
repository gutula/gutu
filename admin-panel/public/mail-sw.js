/* Gutu Mail service worker — handles web push notifications.
 *
 *  Registered by the mail plugin's NotificationsTab when the user
 *  opts in. Receives `push` events with a JSON payload of
 *  `{ title, body, url, tag }` and surfaces them as native notifications.
 *  Click on the notification opens / focuses the SPA at `url`. */

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (err) {
    data = { title: "Gutu Mail", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "Gutu Mail";
  const opts = {
    body: data.body || "",
    tag: data.tag || undefined,
    icon: "/mail-icon.png",
    badge: "/mail-badge.png",
    data: { url: data.url || "/#/mail" },
    requireInteraction: false,
    silent: false,
  };
  event.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/#/mail";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          client.focus();
          if ("navigate" in client) {
            try { client.navigate(target); } catch (_e) { /* ignore */ }
          }
          return;
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    }),
  );
});
