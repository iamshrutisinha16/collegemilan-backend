const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  qualificationId: mongoose.Schema.Types.ObjectId,
  orderId: String,
  paymentId: String,
  status: String,
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);