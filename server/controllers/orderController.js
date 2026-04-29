const Order = require("../models/Order");
const Product = require("../models/Product");

const SHIPPING_WITH_GST = 94; // ₹80 + 18% GST

exports.createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      deliveryMethod,   // "HOME_DELIVERY" | "PICKUP"
      paymentMethod,    // "UPI" | "PICKUP_PAY"
      upiTransactionId,
      notes,
    } = req.body;

    // Validate delivery + payment combo
    if (deliveryMethod === "PICKUP" && paymentMethod !== "PICKUP_PAY") {
      return res.status(400).json({ message: "Pickup orders must use PICKUP_PAY" });
    }
    if (deliveryMethod === "HOME_DELIVERY" && paymentMethod !== "UPI") {
      return res.status(400).json({ message: "Home delivery requires UPI payment" });
    }

    // Validate UPI transaction ID (12 digits)
    if (paymentMethod === "UPI") {
      if (!upiTransactionId || !/^\d{12}$/.test(upiTransactionId)) {
        return res.status(400).json({ message: "Valid 12-digit UPI Transaction ID is required" });
      }
    }

    // Validate home delivery address
    if (deliveryMethod === "HOME_DELIVERY") {
      const { line1, city, state, pincode } = customer.address || {};
      if (!line1 || !city || !state || !pincode) {
        return res.status(400).json({ message: "Complete address required for home delivery" });
      }
    }

    // Enrich items and compute subtotal
    let subtotal = 0;
    const enrichedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
      if (!product.inStock) return res.status(400).json({ message: `${product.name} is out of stock` });

      const qty = item.quantity || 1;
      subtotal += product.discountedPrice * qty;

      enrichedItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        discountedPrice: product.discountedPrice,
        quantity: qty,
        isCustom: product.isCustom,
        customNote: item.customNote || "",
      });
    }

    const shippingCost = deliveryMethod === "HOME_DELIVERY" ? SHIPPING_WITH_GST : 0;
    const totalAmount = subtotal + shippingCost;

    const order = await Order.create({
      customer,
      items: enrichedItems,
      subtotal,
      shippingCost,
      totalAmount,
      deliveryMethod,
      paymentMethod,
      upiTransactionId: paymentMethod === "UPI" ? upiTransactionId : undefined,
      notes,
      status: "Pending",
    });

    res.status(201).json({ success: true, orderId: order.orderId, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).populate("items.product", "name image");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.trackByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });
    const orders = await Order.find({ "customer.email": email }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};