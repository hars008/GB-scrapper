const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  IP: { type: String},
  createdAt: { type: Date, default: Date.now, expires: 600 }, // 10 minutes 
});

const OTP = mongoose.model("otp", otpSchema);

module.exports = OTP;

// byGoogle: { type: Boolean, default: false},
