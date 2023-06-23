const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    userId: { type: String, default: null },
    fingerPrint: { type: String },
    IP: { type: String, required: true },
    action: { type: String, default: "login" },
    time: { type: Date, required: true },
    LoggedIn: { type: Boolean, required: true },
    token: { type: String },

});

const SessionModel = mongoose.model("Session", SessionSchema);

module.exports = SessionModel;
