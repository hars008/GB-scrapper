const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const verifyRefreshToken = require("../utils/verifyRefreshToken");

const verifyAuthRefreshToken = async (refreshToken, token, ip, fingerprint) => {
  try {
    let decodedpayload, accessToken;
    if (!refreshToken) {
      return Promise.reject({
        status: 401,
        message: "Please Login !!",
      });
    } else {
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, decoded) => {
          if (err) {
            return Promise.reject({
              status: 500,
              message: "Server Error! Please Login Again!!",
            });
          }
          // console.log("jwtAuth:", decoded);
          decodedpayload = decoded;
          accessToken = token;
        });
      } else {
        const { username, email, id, fingerPrint } = await verifyRefreshToken(
          refreshToken,
          ip,
          fingerprint
        );
        const payload = {
          username: username,
          email: email,
          id: id,
          fingerPrint: fingerPrint,
        };
        console.log(payload);
        const Token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "10m",
        });
        accessToken = Token;
        decodedpayload = payload;
      }
    }

    if (decodedpayload) {
      return Promise.resolve({
        decoded: decodedpayload,
        accessToken: accessToken,
      });
    } else {
      return Promise.reject({
        status: 500,
        message: "Server Error! Please Login Again!!",
      });
    }
  } catch (err) {
    return Promise.reject({
      status: 500,
      message: "Server Error! Please Login Again!!",
    });
  }
};
module.exports = verifyAuthRefreshToken;
