// server/models/PushSubscription.js
const mongoose = require("mongoose");

const pushSubscriptionSchema = new mongoose.Schema(
  {
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
    // Which admin this belongs to (by email)
    adminEmail: { type: String, default: "studiotrikriti@gmail.com" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PushSubscription", pushSubscriptionSchema);