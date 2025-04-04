const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token)
      return res.status(401).json({
        message: "Unauthorized Access Denied",
      });
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) throw new Error("User not found");
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
module.exports = { userAuth };
