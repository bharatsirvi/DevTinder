const express = require("express");
const User = require("../models/userModel");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateLoginData, validateSignupData } = require("../utils/validate");

authRouter.post("/signup", async (req, res) => {
  try {
    await validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHashed = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHashed,
    });
    await user.save();
    const token = await user.getJWT();
    res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ message: "Registration Successfully", data: user });
  } catch (error) {
    res.status(400).json({
      type: "error",
      message: error.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLoginData(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({
      emailId: emailId,
    });
    if (!user) throw new Error("Invaild credential");
    const isCorrectPassword = await user.validPassword(password);
    if (!isCorrectPassword) throw new Error("Invaild credential");
    const token = await user.getJWT();
    res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ message: "Login successfully", data: user });
  } catch (error) {
    res.status(400).json({
      type: "error",
      message: error.message,
    });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.json({ message: "Logout successfully" });
});

module.exports = authRouter;
