const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "first name is required"],
  },
  last_name: {
    type: String,
    required: [true, "last name is required"],
  },
  NIN: {
    type: String,
    required: [true, "NIN is requiired"],
    unique: [true, "This Identification Number already exists!"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
