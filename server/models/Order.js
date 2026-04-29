const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const SHIPPING_COST = 80;
const SHIPPING_GST_RATE = 0.18; // 18% GST on shipping
const SHIPPING_WITH_GST = Math.round(SHIPPING_COST * (1 + SHIPPING_GST_RATE)); // ₹94

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      default: () => "TKS-" + uuidv4().split("-")[0].toUpperCase(),
      unique: true,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        line1: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
      },
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        image: String,
        price: Number,
        discountedPrice: Number,
        quantity: { type: Number, default: 1 },
        isCustom: { type: Boolean, default: false },
        customNote: String,
      },
    ],
    subtotal: { type: Number, required: true },           // items total
    shippingCost: { type: Number, default: 0 },           // 0 for pickup, 94 for delivery
    totalAmount: { type: Number, required: true },         // subtotal + shippingCost

    deliveryMethod: {
      type: String,
      enum: ["HOME_DELIVERY", "PICKUP"],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["UPI", "PICKUP_PAY"],               // PICKUP_PAY = pay at pickup
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    // UPI verification — 12-digit UTR number
    upiTransactionId: {
      type: String,
      validate: {
        validator: (v) => !v || /^\d{12}$/.test(v),
        message: "UPI Transaction ID must be exactly 12 digits",
      },
    },
    upiVerified: { type: Boolean, default: false }, // Admin marks this true after checking

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Ready for Pickup", "Picked Up"],
      default: "Pending",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

// Export shipping constants for reuse in controller
orderSchema.statics.SHIPPING_COST = SHIPPING_COST;
orderSchema.statics.SHIPPING_WITH_GST = SHIPPING_WITH_GST;

module.exports = mongoose.model("Order", orderSchema);