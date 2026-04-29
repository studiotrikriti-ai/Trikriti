const express = require("express");
const router = express.Router();
const { createOrder, trackOrder, trackByEmail } = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/track/:orderId", trackOrder);
router.get("/track", trackByEmail);

module.exports = router;
