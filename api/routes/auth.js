const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = express.Router();
require("dotenv").config();
const Session = require("../models/Sessions");
const generateTokens = require("../utils/generateTokens");
const UserToken = require("../models/UserToken");
const verifyAuthRefreshToken = require("../middleware/jwtRefreshAuth");
const uaParser = require("ua-parser-js");
const verifyCaptcha = require("../utils/verifyCaptcha");
const bcryptSalt = bcrypt.genSaltSync(12);

router.use(async (req, res, next) => {
  const { token } = req.cookies;
  let loggedIn = true;
  let fingerPrint;
  if (req.path == "/logout" || req.path == "/register") {
    loggedIn = false;
  }
  if (req.path == "/profile") {
    loggedIn = true;
    fingerPrint = req.params.fingerprint;
  } else {
    fingerPrint = req.body.fingerPrint;
  }
  await Session.create({
    fingerPrint: fingerPrint,
    token: token ? token : null,
    time: new Date(Date.now()),
    IP: req.clientIp,
    LoggedIn: loggedIn,
    action: req.path,
  });
  next();
});

mongoose.connect(process.env.MONGO_URL);

router.post("/login", async (req, res) => {
  const { user, password, fingerPrint, captchaToken } = req.body;
  const ua = uaParser(req.headers["user-agent"]);

  try {
    const captchaOk = await verifyCaptcha(captchaToken);
    if (!captchaOk) {
      return res.status(401).json("Invalid Captcha");
    }

    let userDoc = await User.findOne({ email: user });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        const { accessToken, refreshToken, tokkn } = await generateTokens(
          userDoc,
          req.clientIp,
          fingerPrint,
          ua
        );
        await Session.create({
          userId: userDoc._id,
          fingerPrint: fingerPrint,
          token: accessToken,
          time: new Date(Date.now()),
          IP: req.clientIp,
          LoggedIn: true,
        });
        res
          .cookie("token", accessToken, tokkn("access"))
          .cookie("refreshToken", refreshToken, tokkn("refresh"))
          .json({ userDoc, accessToken, refreshToken });
      } else res.status(401).json("Invalid Credentials");
    } else res.status(422).json("Invalid Credentials");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password, captchaToken } = req.body;

  try {
    const captchaOk = await verifyCaptcha(captchaToken);
    if (!captchaOk) {
      return res.status(401).json("Invalid Captcha");
    }

    const user = await User.findOne({ email: email });
    if (user)
      return res.status(422).json("You are Already Registered, Please Login!!");

    const userDoc = await User.create({
      username: username,
      email: email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    console.log(userDoc);
    res.json(userDoc);
  } catch (err) {
    console.log(err);
    res.status(422).json(err);
  }
});

router.get("/profile/:fingerprint", async (req, res) => {
  const { token, refreshToken } = req.cookies;
  const { fingerprint } = req.params;
  // console.log(token, refreshToken, fingerprint);
  try {
    const { decoded, accessToken } = await verifyAuthRefreshToken(
      refreshToken,
      token,
      req.clientIp,
      fingerprint
    );
    token
      ? res.json({ decoded, token, refreshToken })
      : res
          .cookie("token", accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            // domain: ".netlify.app",
            // path: "/",
            expires: new Date(Date.now() + 10 * 1000 * 60),
          })
          .status(200)
          .json({ decoded, accessToken, refreshToken });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/logout", async (req, res) => {
  try {
    const { token, refreshToken } = req.cookies;
    const userToken = await UserToken.findOne({ token: refreshToken });
    if (userToken) {
      await UserToken.deleteOne({ token: refreshToken });
      console.log("token deleted");
    }
    res
      .clearCookie("token")
      .clearCookie("refreshToken")
      .json("logged out successfully");
  } catch (err) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// router.get("/csrf-token" , (req, res) => {
//   res.json({ csrfToken: req.csrfToken});
// });

module.exports = router;
//previous code have lines 190
