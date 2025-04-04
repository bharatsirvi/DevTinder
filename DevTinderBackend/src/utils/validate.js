const validator = require("validator");
const User = require("../models/userModel");
const { Connection } = require("mongoose");
const ConnectionRequest = require("../models/connectionRequestModel");

const validateSignupData = async (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName) throw new Error("First name is must required");
  if (!lastName) throw new Error("Last name is must required");
  if (!emailId) throw new Error("Email Id must required");
  if (!password) throw new Error("Password must required");
  if (!validator.isEmail(emailId)) throw new Error("Email Id is not valid");
  if (!validator.isStrongPassword(password))
    throw new Error("Password must be Strong");
  const user = await User.findOne({ emailId: emailId });
  if (user) throw new Error("User already registerd");
};

const validateLoginData = (req) => {
  const { emailId, password } = req.body;
  if (!emailId) throw new Error("Email Id must required");
  if (!password) throw new Error("Password must required");
  if (!validator.isEmail(emailId)) throw new Error("Email Id is not valid");
};

const validateEditProfileData = (req) => {
  const ALLOWED_EDIT_FIELDS = [
    "firstName",
    "lastName",
    "photoUrl",
    "about",
    "age",
    "gender",
    "skills",
  ];
  const isAllowToEdit = Object.keys(req.body).every((key) =>
    ALLOWED_EDIT_FIELDS.includes(key)
  );
  if (!isAllowToEdit) throw new Error("Invaild Edit Request");
};

const validatePasswordData = async (req) => {
  if (!req.body?.oldPassword || !req.body?.newPassword)
    throw new Error("Invaild Request");
  const { oldPassword, newPassword } = req.body;
  const user = req.user;
  const isValidPassword = await user.validPassword(oldPassword);
  if (!isValidPassword) {
    throw new Error("Incorrect Password");
  }
  if (!validator.isStrongPassword(newPassword))
    throw new Error("Password must be Strong");
};

const validateSendRequest = async (req) => {
  const fromUserId = req.user._id;
  const toUserId = req.params?.toUserId;
  const status = req.params?.status;
  if (!toUserId || !status) throw new Error("Invaild Send Request");
  const ALLOWED_STATUS_TYPE = ["ignored", "interested"];
  if (!ALLOWED_STATUS_TYPE.includes(status))
    throw new Error("Invaild status type");

  const toUser = await User.findById(toUserId);
  if (!toUser) throw new Error("User Not Found");
  const existingConnection = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });
  if (existingConnection) throw new Error("connection already exist");
  req.toUser = toUser;
};

const validateReviewRequest = (req) => {
  const status = req.params?.status;
  const ALLOWED_STATUS_TYPE = ["accepted", "rejected"];
  if (!ALLOWED_STATUS_TYPE.includes(status))
    throw new Error("Invaild status type");
};

module.exports = {
  validateSignupData,
  validateLoginData,
  validateEditProfileData,
  validatePasswordData,
  validateSendRequest,
  validateReviewRequest,
};
