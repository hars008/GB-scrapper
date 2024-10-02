const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
require("dotenv").config();
const mailPass = process.env.EMAIL_PASS;
const transporter = nodemailer.createTransport({
  // host: "smtp.zeptomail.com",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    // user: "emailapikey",
    user: "20126@iiitu.ac.in",
    pass: mailPass,
  },
});

const generateOTP = () => {
  const digits =
    "0123456789@#$&qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
  let OTP = "";
  for (let i = 0; i < 8; i++) {
    OTP += digits[Math.floor(Math.random() * digits.length)];
  }
  return OTP;
};
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const ip = req.clientIp;
    console.log(ip);
    const otp = generateOTP();

    

    let otpDoc = await Otp.findOneAndUpdate(
      { email: email },
      { otp: otp },
      { upsert: true, new: true } // upsert: true creates a new document if it doesn't exist already and new: true returns the updated document
    );

    const message = `
      <p>Dear user,</p>
      <p>Please verify your email address by entering the OTP provided below:</p>
      <h2 style="color: blue; font-style: italic;">${otp}</h2>
      <p>This OTP is valid for 5 minutes. If you didn't request it, please ignore this email.</p>
      <p>Thank you.</p>
    `;

    const mailOptions = {
      from: "20126@iiitu.ac.in",
      to: email,
      subject: "Email Verification OTP",
      html: message,
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
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  Otp.findOne({ email: email }, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    } else if (data) {
      if (data.otp === otp) {
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.json({ token: token });
      } else {
        res.status(401).json({ error: "Invalid OTP" });
      }
    } else {
      res.status(401).json({ error: "Invalid OTP" });
    }
  });
});

//   // console.log(otp);

//   // const message = `HELLO`;
//   const message = `<p>Please don't share this OTP with anyone. Kindly verify if you are the one who requested for it. Your OTP i <span style="color:blue; text-decoration:underline;">s ${otp</span>}. This OTP is valid for 5 minutes. <br><br>Kindly ignore if you didn't request for it.<p>`;
//   // const recipient = "harshbansal699@gmail.com";
//   const mailOptions = {
//     // from: "intern@devmail.webnewsobserver.com",
//     from: "20126@iiitu.ac.in",
//     to: email,
//     subject: "OTP",
//     text: message,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error("Error sending email:", error);
//       res.status(500).json({ error: "Failed to send email" });
//     } else {
//       console.log("Email sent:", info.response);
//       res.json({ message: "Email sent successfully" });
//     }
//   });
// });

module.exports = router;
