const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyAuthRefreshToken = require("./jwtRefreshAuth");


const verifyToken =async (req, res, next) => {
  const {token, refreshToken }= req.cookies;
  const fingerPrint = req.headers["x-fingerprint"];
  const ip = req.clientIp;
  try{
    const {decoded, accessToken} = await verifyAuthRefreshToken(refreshToken, token, ip, fingerPrint);
    if(!token){
      res.cookie("token", accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 1000 * 60 * 10,  //10 minutes
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(err.status).json(err.message);
  }
};
module.exports = verifyToken;
