const mongoose = require("mongoose");
const { boolean } = require("joi");

const contactFormSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userMessage: { type: String, required: true },
  createdAt: {
    type: String,
    required: true,
  },
  isDeleted: { type: Boolean, required: false, default: false },
  updatedTime: { type: String, required: false, default: "" },
});

const User = mongoose.model("UserInfo", contactFormSchema);

exports.User = User;
