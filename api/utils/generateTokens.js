const jwt = require("jsonwebtoken");
const UserToken = require("../models/UserToken");

const generateTokens = async (userDoc, ip, fingerPrint, ua) => {
  try {
    const payload = {
      username: userDoc.username,
      email: userDoc.email,
      id: userDoc._id,
      fingerPrint,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_JWT_SECRET, {
      expiresIn: "15d",
    });
    const tokkn = (type) => ({
      httpOnly: true,
      sameSite: "none",
      secure: true,
      // domain: "jazzy-tulumba-a1e579.netlify.app",
      // path: "/",
      expires: new Date(
        Date.now() +
          (type == "access" ? 10 * 1000 * 60 : 15 * 24 * 1000 * 60 * 60) // 10m : 15d
      ),
    });
    await UserToken.create({
      userId: userDoc._id,
      token: refreshToken,
      IP: ip,
      fingerPrint,
      ua: ua,
    });
    return Promise.resolve({ accessToken, refreshToken, tokkn });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = generateTokens;
