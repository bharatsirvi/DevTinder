const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 20,
    },
    emailId: {
      type: String,
      require: true,
      maxLength: 30,
      lowercase: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("Email must be in vaild format");
      },
    },
    password: {
      type: String,
      require: true,
      validate(value) {
        if (!validator.isStrongPassword(value))
          throw new Error("password must be strong");
      },
    },
    age: {
      type: Number,
      max: 100,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender is not valid type");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBvcnRyYWl0fGVufDB8fDB8fHww",
      validate(value) {
        if (!validator.isURL(value))
          throw new Error("photoUrl is not valid url");
      },
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
      maxLength: 20,
      validate(value) {
        if (value.length > 10) throw new Error("Skill cannot be more then 10");
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};
userSchema.methods.validPassword = async function (passwordInputByUser) {
  const isValidPassword = await bcrypt.compare(
    passwordInputByUser,
    this.password
  );
  return isValidPassword;
};
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
