const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();


const mailPass = process.env.EMAIL_PASS;
const transporter = nodemailer.createTransport({
  // host: "smtp.zeptomail.com",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // user: "emailapikey",
    user: "20126@iiitu.ac.in",
    pass: mailPass,
  },
});


router.get("/send-email", (req, res) => {
  // const { stockPrice, recipient } = req.body;
  const message = `HELLO`;
  const recipient = "harshbansal699@gmail.com";
  const mailOptions = {
    from: "intern@devmail.webnewsobserver.com",
    to: recipient,
    subject: "OTP",
    text: message,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    } else {
      console.log("Email sent:", info.response);
      res.json({ message: "Email sent successfully" });
    }
  });
});

module.exports = router;