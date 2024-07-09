const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require('express-async-handler');
const User = require('../../models/UserModel'); // Adjust the path as needed
require('dotenv').config();

const app_sk = process.env.APP_SK;

const signInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      message: 'All fields are required'
    });
  }

  const user = await User.findOne({ email });
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, app_sk, { expiresIn: '30d' });

  res.json({
    message: 'Login successful',
    token,
    user: user
  });
});

module.exports = signInUser;
