// Pressure-It Service Worker — Push Notifications

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || "Pressure-It";
  const options = {
    body: data.body || "You have a new notification",
    icon: "/icons/icon-512.jpg",
    badge: "/icons/icon-512.jpg",
    tag: data.tag || "pressure-it-notification",
    data: {
      url: data.url || "/admin/quotes",
    },
    vibrate: [200, 100, 200],
    actions: [
      { action: "open", title: "View" },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/admin/quotes";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Focus existing window if open
      for (const client of windowClients) {
        if (client.url.includes("/admin") && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Otherwise open a new window
      return clients.openWindow(url);
    })
  );
});
