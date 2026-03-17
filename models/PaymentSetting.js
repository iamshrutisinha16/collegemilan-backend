const mongoose = require("mongoose");
const paymentSettingSchema = new mongoose.Schema({
  razorpayKeyId: { type: String, default: "" },
  razorpayKeySecret: { type: String, default: "" },
  isActive: { type: Boolean, default: false } // Payment on/off karne ke liye
});
module.exports = mongoose.model("PaymentSetting", paymentSettingSchema);