const mongoose = require("mongoose");

const userTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  IP: { type: String, required: true },
  fingerPrint: { type: String, required: true },
  ua: { type: Object, required: true },
});

const UserToken = mongoose.model("UserToken", userTokenSchema);

// Background task to delete expired tokens
const deleteExpiredTokens = async () => {
  const expirationTime = new Date(Date.now() - 15 * 1000 *60*60*30); // 15 days
  await UserToken.deleteMany({ createdAt: { $lte: expirationTime } });
};

// Schedule the background task to run every day
setInterval(deleteExpiredTokens,  1000*60*60*30);

module.exports = UserToken;

// byGoogle: { type: Boolean, default: false},
