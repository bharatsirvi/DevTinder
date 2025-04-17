const express = require("express");
const { userAuth } = require("../middleware/auth");
const {
  validateEditProfileData,
  validatePasswordData,
} = require("../utils/validate");

const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const bcrypt = require("bcrypt");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, (req, res) => {
  res.json({
    message: "profile data",
    data: req.user,
  });
});

profileRouter.post(
  "/profile/edit",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    console.log(req.body);
    try {
      validateEditProfileData(req);
      const loggedInUser = req.user;

      // Handle photo upload to Cloudinary
      if (req.file) {
        try {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "profile-photos",
            public_id: `user-${loggedInUser._id}`,
            overwrite: true,
            transformation: [
              { width: 300, height: 500, crop: "limit" },
              { quality: "100" },
            ],
          });

          // Delete local file after upload
          await unlinkFile(req.file.path);

          // Save Cloudinary URL to database
          loggedInUser.photoUrl = result.secure_url;
        } catch (uploadError) {
          await unlinkFile(req.file.path);
          throw new Error("Failed to upload image to Cloudinary");
        }
      }

      // Update other fields
      Object.keys(req.body).forEach((key) => {
        if (key !== "photo") {
          loggedInUser[key] = req.body[key];
        }
      });

      await loggedInUser.save();

      res.json({
        success: true,
        message: `${loggedInUser.firstName}'s profile updated successfully`,
        data: loggedInUser,
      });
    } catch (error) {
      // Clean up uploaded file if error occurred
      if (req.file) {
        try {
          await unlinkFile(req.file.path);
        } catch (cleanupError) {
          console.error("Error cleaning up file:", cleanupError);
        }
      }

      res.status(400).json({
        success: false,
        type: "error",
        message: error.message,
      });
    }
  }
);
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
