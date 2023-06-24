const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateTokens = require("../utils/generateTokens");
const uaParser = require("ua-parser-js");

const bcryptSalt = bcrypt.genSaltSync(12);

const {
  getGoogleOAuthTokens,
  getGoogleUser,
} = require("../utils/googleOAuthToken");

router.get("/google/", async (req, res) => {
  const code = req.query.code;
  // console.log("code:", code);
  const ua = uaParser(req.headers["user-agent"]);
  console.log(ua);
  try {
    const { id_token, access_token, refresh_token } =
      await getGoogleOAuthTokens(code);

    const user = await getGoogleUser({ access_token, id_token });
    console.log("googleUser:",user);

    if (!user.verified_email) return res.status(401).send("Email not verified");

    const userDoc = await User.findOne({ email: user.email });
    console.log(userDoc? "userDoc exists":"userDoc does not exist");

    if (!userDoc) {
      const newUser = await User.create({
        username: user.name,
        email: user.email,
        password: bcrypt.hashSync(user.id, bcryptSalt),
        googleId: user.id,
        googleAccessToken: access_token,
        googleRefreshToken: refresh_token,
      });
      const { accessToken, refreshToken } = await generateTokens(
        newUser,
        req.clientIp,
        "by-google",
        ua
      );
      res
        .cookie("token", accessToken, {
          httpOnly: true,
          SameSite: "none",
          expires: new Date(Date.now() + 10 * 1000 * 60),
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          SameSite: "none",
          expires: new Date(Date.now() + 10 * 1000 * 60 * 60 * 24 * 30),
        })
        .status(200)
        .redirect("http://localhost:3000");

    } else {
      const { accessToken, refreshToken } = await generateTokens(
        userDoc,
        req.clientIp,
        "by-google",
        ua
      );
      res
        .cookie("token", accessToken, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          expires: new Date(Date.now() + 1 * 1000 * 60),
        })

        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          expires: new Date(Date.now() + 10 * 1000 * 60 * 60 * 24 * 30), 
        })
        .redirect("http://localhost:3000");
    }

    // res.redirect("http://localhost:3000");
  } catch (err) {
    console.log(err);
    res.status(err.status).send(err.message);
  }
});

module.exports = router;
