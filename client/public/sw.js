// public/sw.js
// Service Worker for Trikriti Studio push notifications
// Place this file in: client/public/sw.js

self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body || "You have a new notification",
    icon: "/trikriti. (4).png",      // your logo in /public
    badge:"/trikriti. (4).png",
    vibrate: [200, 100, 200],
    tag: data.tag || "trikriti-notification",  // same tag = replace old notification
    renotify: true,
    data: {
      url: data.url || "/admin/orders",        // where to go on click
    },
    actions: [
      { action: "view", title: "View Order" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Trikriti Studio", options)
  );
});

// Click on notification → open admin orders page
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/admin/orders";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If admin tab is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open new tab
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});