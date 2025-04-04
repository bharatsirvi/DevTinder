const express = require("express");
const { userAuth } = require("../middleware/auth");
const {
  validateEditProfileData,
  validatePasswordData,
} = require("../utils/validate");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, (req, res) => {
  res.json({
    message: "profile data",
    data: req.user,
  });
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    validateEditProfileData(req);
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} profile is updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).json({
      type: "error",
      message: error.message,
    });
  }
});

profileRouter.post("/profile/password", userAuth, async (req, res) => {
  try {
    await validatePasswordData(req);
    const { newPassword } = req.body;
    const user = req.user;
    const passwordHashed = await bcrypt.hash(newPassword, 10);
    user.password = passwordHashed;
    await user.save();
    res.json({
      message: "Password Changed Successfully",
    });
  } catch (error) {
    res.status(400).json({
      type: "error",
      message: error.message,
    });
  }
});

module.exports = profileRouter;
