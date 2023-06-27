const mongoose = require("mongoose");

const csrfTokenSchema = new mongoose.Schema({
  csrfToken: { type: String, required: true },
  time: { type: Date, default: Date.now },
  IP: { type: String, required: true , unique: true},
});

const CsrfToken = mongoose.model("CsrfToken", csrfTokenSchema);

module.exports = CsrfToken;

// byGoogle: { type: Boolean, default: false},
