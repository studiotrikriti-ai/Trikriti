const express = require("express");
const router = express.Router();
const {
  updateProduct,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  verifyUpiAndConfirm,
} = require("../controllers/adminController");
const {
  adminGetAll,
  adminUpdateCustomOrder,
} = require("../controllers/customOrderController");
const { verifyAdmin } = require("../middleware/auth");

router.use(verifyAdmin);

// Dashboard
router.get("/stats", getDashboardStats);

// Regular orders
router.get("/orders", getAllOrders);
router.patch("/orders/:orderId", updateOrderStatus);
router.patch("/orders/:orderId/verify-upi", verifyUpiAndConfirm); // verify UPI + mark paid

// Products (price/discount/stock only)
router.patch("/products/:id", updateProduct);

// Custom orders
router.get("/custom-orders", adminGetAll);
router.patch("/custom-orders/:customOrderId", adminUpdateCustomOrder);

module.exports = router;