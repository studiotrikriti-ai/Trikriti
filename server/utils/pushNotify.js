// server/utils/pushNotify.js
// Call this whenever you want to send a push notification to the admin

const webpush = require("web-push");
const PushSubscription = require("../models/PushSubscription");

// Configure VAPID — run "npx web-push generate-vapid-keys" to get these
webpush.setVapidDetails(
  "mailto:studiotrikriti@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/**
 * Send push notification to all stored admin subscriptions
 * @param {object} payload - { title, body, url, tag }
 */
const pushNotify = async (payload) => {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.warn("[Push] VAPID keys not set — skipping push notification");
    return;
  }

  const subscriptions = await PushSubscription.find({});
  if (!subscriptions.length) return;

  const notification = JSON.stringify({
    title: payload.title || "Trikriti Studio",
    body: payload.body || "You have a new notification",
    url: payload.url || "/admin/orders",
    tag: payload.tag || "order",
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: sub.keys },
        notification
      )
    )
  );

  // Clean up expired/invalid subscriptions
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === "rejected") {
      const statusCode = result.reason?.statusCode;
      if (statusCode === 410 || statusCode === 404) {
        // Subscription expired — remove it
        await PushSubscription.deleteOne({ endpoint: subscriptions[i].endpoint });
        console.log("[Push] Removed expired subscription");
      } else {
        console.error("[Push] Failed to send:", result.reason?.message);
      }
    }
  }
};

module.exports = pushNotify;