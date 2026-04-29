// /seed/seedProducts.js
// Run: npm run seed (from /server directory)

require("dotenv").config({ path: "../.env" });
require("dotenv").config(); // fallback: look in current dir

const mongoose = require("mongoose");
const Product = require("../models/Product");
const products = require("./products");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/trikriti-studio";

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB:", MONGODB_URI);

    // Clear existing products
    const deleted = await Product.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing products`);

    // Insert seed products
    const inserted = await Product.insertMany(products);
    console.log(`🌱 Seeded ${inserted.length} products:`);

    inserted.forEach((p, i) => {
      console.log(
        `   ${i + 1}. ${p.isCustom ? "[CUSTOM]" : "[NORMAL]"} ${p.name} — ₹${p.discountedPrice}`
      );
    });

    console.log("\n✨ Seeding complete! Trikriti Studio is ready to go.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();
