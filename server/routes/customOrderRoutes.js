const express = require("express");
const router = express.Router();
const {
  submitInquiry,
  trackCustomOrder,
  submitUpiPayment,
} = require("../controllers/customOrderController");

// Public
router.post("/", submitInquiry);
router.get("/track/:customOrderId", trackCustomOrder);
router.post("/pay", submitUpiPayment);

module.exports = router;