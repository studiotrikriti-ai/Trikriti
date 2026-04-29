// server/routes/pushRoutes.js
const express = require("express");
const router = express.Router();
const PushSubscription = require("../models/PushSubscription");
const { verifyAdmin } = require("../middleware/auth");

// Admin saves their browser subscription
router.post("/subscribe", verifyAdmin, async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ message: "Invalid subscription object" });
    }

    // Upsert — update if exists, create if not
    await PushSubscription.findOneAndUpdate(
      { endpoint },
      { endpoint, keys, adminEmail: req.admin.email },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "Push subscription saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin unsubscribes (optional)
router.post("/unsubscribe", verifyAdmin, async (req, res) => {
  try {
    const { endpoint } = req.body;
    await PushSubscription.deleteOne({ endpoint });
    res.json({ success: true, message: "Unsubscribed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Return VAPID public key to client (needed to subscribe)
router.get("/vapid-public-key", (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || "" });
});

module.exports = router;