const CustomOrder = require("../models/CustomOrder");
const Product = require("../models/Product");

// ── PUBLIC: Submit custom order inquiry ─────────────────────────────
exports.submitInquiry = async (req, res) => {
  try {
    const {
      customer,
      productId,
      customDescription,
      referenceImageUrl,
      deliveryMethod,
      address,
    } = req.body;

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ message: "Name, email, and phone are required" });
    }
    if (!customDescription) {
      return res.status(400).json({ message: "Please describe what you want" });
    }
    if (!deliveryMethod) {
      return res.status(400).json({ message: "Delivery method is required" });
    }
    if (deliveryMethod === "HOME_DELIVERY") {
      if (!address?.line1 || !address?.city || !address?.state || !address?.pincode) {
        return res.status(400).json({ message: "Complete address required for home delivery" });
      }
    }

    let productName = "Custom 3D Print";
    if (productId) {
      const product = await Product.findById(productId);
      if (product) productName = product.name;
    }

    const customOrder = await CustomOrder.create({
      customer,
      productRef: productId || undefined,
      productName,
      customDescription,
      referenceImageUrl: referenceImageUrl || undefined,
      deliveryMethod,
      address: deliveryMethod === "HOME_DELIVERY" ? address : {},
    });

    res.status(201).json({
      success: true,
      customOrderId: customOrder.customOrderId,
      message: "Custom order inquiry received! We will contact you shortly with pricing.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUBLIC: Track custom order ──────────────────────────────────────
exports.trackCustomOrder = async (req, res) => {
  try {
    const order = await CustomOrder.findOne({ customOrderId: req.params.customOrderId });
    if (!order) return res.status(404).json({ success: false, message: "Custom order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUBLIC: Customer submits UPI after admin quotes price ───────────
exports.submitUpiPayment = async (req, res) => {
  try {
    const { customOrderId, upiTransactionId } = req.body;
    if (!upiTransactionId || !/^\d{12}$/.test(upiTransactionId)) {
      return res.status(400).json({ message: "Valid 12-digit UPI Transaction ID required" });
    }
    const order = await CustomOrder.findOne({ customOrderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.upiTransactionId = upiTransactionId;
    order.paymentMethod = "UPI";
    order.paymentStatus = "Pending"; // Admin will verify and mark Paid
    await order.save();

    res.json({ success: true, message: "Payment submitted. Admin will verify and confirm your order." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADMIN: Get all custom orders ────────────────────────────────────
exports.adminGetAll = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;

    const orders = await CustomOrder.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CustomOrder.countDocuments(filter);
    res.json({ success: true, orders, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADMIN: Update custom order (set price, status, verify UPI) ──────
exports.adminUpdateCustomOrder = async (req, res) => {
  try {
    const { customOrderId } = req.params;
    const {
      quotedPrice,
      shippingCost,
      status,
      upiVerified,
      paymentStatus,
      adminNotes,
    } = req.body;

    const order = await CustomOrder.findOne({ customOrderId });
    if (!order) return res.status(404).json({ message: "Custom order not found" });

    if (quotedPrice !== undefined) order.quotedPrice = quotedPrice;
    if (shippingCost !== undefined) order.shippingCost = shippingCost;
    if (quotedPrice !== undefined || shippingCost !== undefined) {
      order.totalAmount = (order.quotedPrice || 0) + (order.shippingCost || 0);
    }
    if (status) order.status = status;
    if (upiVerified !== undefined) {
      order.upiVerified = upiVerified;
      if (upiVerified) order.paymentStatus = "Paid";
    }
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (adminNotes !== undefined) order.adminNotes = adminNotes;

    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};