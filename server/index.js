require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const keepAlive = require("./utils/keepalive");


const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");
const customOrderRoutes = require("./routes/customOrderRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/custom-orders", customOrderRoutes);
app.get("/api/health", (_, res) => res.json({ status: "OK", brand: "Trikriti Studio" }));

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/trikriti-studio")
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Trikriti Studio Server → http://localhost:${PORT}`);
      keepAlive(); // Start Render keep-alive pinger
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });
