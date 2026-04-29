const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const customOrderSchema = new mongoose.Schema(
  {
    customOrderId: {
      type: String,
      default: () => "TKC-" + uuidv4().split("-")[0].toUpperCase(),
      unique: true,
    },
    // Customer details
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },

    // What they want
    productRef: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // which custom product they picked
    productName: { type: String, required: true },
    customDescription: { type: String, required: true }, // what customization they want
    referenceImageUrl: { type: String }, // optional image they upload (cloudinary url)

    // Delivery preference
    deliveryMethod: {
      type: String,
      enum: ["HOME_DELIVERY", "PICKUP"],
      required: true,
    },
    address: {
      line1: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },

    // Pricing — SET BY ADMIN only
    quotedPrice: { type: Number, default: null },        // admin fills this
    shippingCost: { type: Number, default: null },        // admin fills (94 or 0)
    totalAmount: { type: Number, default: null },         // admin fills

    // Status
    status: {
      type: String,
      enum: [
        "Inquiry Received",   // just submitted
        "Pricing Sent",       // admin quoted price, waiting for customer approval
        "Confirmed",          // customer confirmed (admin marks)
        "In Production",
        "Ready for Pickup",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Inquiry Received",
    },

    // Payment
    paymentMethod: {
      type: String,
      enum: ["UPI", "PICKUP_PAY", ""],
      default: "",
    },
    upiTransactionId: {
      type: String,
      validate: {
        validator: (v) => !v || /^\d{12}$/.test(v),
        message: "UPI Transaction ID must be exactly 12 digits",
      },
    },
    upiVerified: { type: Boolean, default: false },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    // Admin notes / communication log
    adminNotes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomOrder", customOrderSchema);