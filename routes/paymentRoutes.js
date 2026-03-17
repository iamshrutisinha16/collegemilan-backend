const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const PaymentSetting = require("../models/PaymentSetting");
const Payment = require("../models/Payment");

const router = express.Router();

// 1️⃣ Create Order (Dynamic keys se)
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    // Database se Keys nikaalo
    const settings = await PaymentSetting.findOne();

    // Check karo ki keys hain ya nahi, aur Payment chalu hai ya nahi
    if (!settings || !settings.isActive || !settings.razorpayKeyId) {
      return res.status(400).json({ message: "Payment Gateway is currently disabled or not configured." });
    }

    // Database wali keys se Razorpay chalu karo
    const razorpay = new Razorpay({
      key_id: settings.razorpayKeyId,
      key_secret: settings.razorpayKeySecret,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // convert to paise
      currency: "INR",
    });

    res.json(order);
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
});

// 2️⃣ Verify Payment (Dynamic Secret se)
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, qualificationId } = req.body;

    // Database se Secret Key nikaalo
    const settings = await PaymentSetting.findOne();
    if (!settings || !settings.razorpayKeySecret) {
      return res.status(400).json({ message: "Payment settings missing" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Database wale secret se signature match karo
    const expectedSignature = crypto
      .createHmac("sha256", settings.razorpayKeySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid Signature" });
    }

    // Save payment in DB
    await Payment.create({
      userId,
      qualificationId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: "paid",
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});

module.exports = router;