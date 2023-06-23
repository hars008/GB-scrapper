const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = (req, res, next) => {
  const {token }= req.cookies;
  console.log(token);

//if token is not present in cookies
  if (!token) {
    return res.status(401).json("You need to Login");
  }
  else{
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) {
        return res.status(500).json(err); //token expired
      }
      else{
        const userDoc = await User.findById(decoded.id);
        if (!userDoc) {
          return res.status(401).json("User not found"); //user deleted
        }
        else{
          req.user = userDoc; //user is present
          next();
        }
      }
    });
  }
};
module.exports = verifyToken;
