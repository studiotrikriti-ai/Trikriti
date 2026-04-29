const Product = require("../models/Product");
const Order = require("../models/Order");
const CustomOrder = require("../models/CustomOrder");

// ── Products ────────────────────────────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    const { price, discount, inStock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (price !== undefined) product.price = price;
    if (discount !== undefined) product.discount = discount;
    if (price !== undefined || discount !== undefined) {
      product.discountedPrice = Math.round(product.price * (1 - product.discount / 100));
    }
    if (inStock !== undefined) product.inStock = inStock;

    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Regular Orders ──────────────────────────────────────────────────
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 30 } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);
    res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus, upiVerified, adminNotes } = req.body;

    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (upiVerified !== undefined) order.upiVerified = upiVerified;
    if (adminNotes !== undefined) order.adminNotes = adminNotes;

    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify UPI → mark paid → confirm order (one click)
exports.verifyUpiAndConfirm = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.upiTransactionId) {
      return res.status(400).json({ message: "No UPI transaction ID on this order" });
    }

    order.upiVerified = true;
    order.paymentStatus = "Paid";
    order.status = "Confirmed";
    await order.save();

    res.json({ success: true, message: "UPI verified — order confirmed", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Dashboard Stats ─────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const confirmedOrders = await Order.countDocuments({ status: "Confirmed" });
    const shippedOrders = await Order.countDocuments({ status: "Shipped" });
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });

    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    const pendingUpi = await Order.countDocuments({
      paymentMethod: "UPI",
      upiVerified: false,
    });

    const totalCustomOrders = await CustomOrder.countDocuments();
    const pendingCustom = await CustomOrder.countDocuments({ status: "Inquiry Received" });

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        totalRevenue,
        pendingUpiVerification: pendingUpi,  // 🔴 highlight unverified UPI
        totalCustomOrders,
        pendingCustomOrders: pendingCustom,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};