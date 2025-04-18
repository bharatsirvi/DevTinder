const express = require("express");
const User = require("../models/userModel");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateLoginData, validateSignupData } = require("../utils/validate");
const admin = require("../utils/firebaseAdmin");
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

authRouter.post("/signup/google", async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name } = decodedToken;

    console.log(email);
    const existingUser = await User.findOne({ emailId: email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const nameParts = name?.trim().split(/\s+/) || [""];
    const firstName = nameParts[0] || "User";
    const lastName =
      nameParts.length > 1 ? nameParts.slice(1).join(" ") : "NULL";

    const user = new User({
      firstName,
      lastName,
      emailId: email,
      authProvider: "google",
      isVerified: true,
    });

    await user.save();

    const token = await user.getJWT();
    res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ message: "Registration Successfully", data: user });
  } catch (err) {
    console.error("Firebase token error:", err);
    res.status(400).json({ message: "Invalid Google token" });
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

authRouter.post("/login/google", async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email } = decodedToken;

    const user = await User.findOne({ emailId: email });

    if (!user) {
      return res.status(404).json({ message: "Please sign up first." });
    }

    const token = await user.getJWT();

    res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ message: "Login successful", data: user });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.json({ message: "Logout successfully" });
});

module.exports = authRouter;
