const UserToken = require("../models/UserToken");
const jwt = require("jsonwebtoken");

const verifyRefreshToken = async (refreshToken, ip,fingerPrint) => {
  try {
    const userToken = await UserToken.findOne({ token: refreshToken });
    if (!userToken) {
      return Promise.reject({ status: 401, message: "Token not found" });
    }
    const payload = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
    if (payload.fingerPrint !== fingerPrint && payload.fingerPrint !== 'by-google') {
        return Promise.reject({ status: 401, message: "Device is changed!! please Login again" });
    }
    if (userToken.IP !== ip) {
        return Promise.reject({
          status: 401,
          message: "Device is changed!! please Login again",
        });
    }
    
    return Promise.resolve(payload);
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = verifyRefreshToken;
