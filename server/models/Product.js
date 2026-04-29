const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // percentage
    discountedPrice: { type: Number, required: true },
    description: { type: String, required: true },
    whyLoveIt: [{ type: String }],
    image: { type: String, default: "/placeholder-product.jpg" },
    images: [{ type: String }],
    isCustom: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    category: { type: String, default: "general" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
