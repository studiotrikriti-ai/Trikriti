const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }
    // TODO: Integrate with email service (e.g., Nodemailer, SendGrid)
    // For now, log and return success
    console.log("📩 Contact form submission:", { name, email, phone, message });
    res.json({ success: true, message: "Message received! We'll get back to you soon." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
