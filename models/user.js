const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: "Email is Required",
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  firstname: {
    type: String,
    required: true,
    min: [2, "Too short, min is 6 characters"]
  },
  lastname: {
    type: String,
    required: true,
    min: [2, "Too short, min is 6 characters"]
  },
  password: {
    type: String,
    min: [8, "Too short, min is 4 characters"],
    max: [32, "Too long, max is 32 characters"],
    required: "Password is required"
  },
  avatar: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("user", userSchema);
