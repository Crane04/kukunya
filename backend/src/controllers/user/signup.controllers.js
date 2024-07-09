// controllers/userController.js
const User = require('../../models/UserModel'); // Adjust the path as needed
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

const signUpUser = asyncHandler(async (req, res) => {
  const { first_name, last_name, NIN, email, password } = req.body;

  if (!first_name || !last_name || !NIN || !email || !password) {
    return res.status(400).json({
      message: 'All fields are required'
    });
  }

  const existingUser = await User.findOne({ $or: [{ NIN }, { email }] });
  if (existingUser) {
    let errorMessage = 'User';
    if (existingUser.NIN === NIN) {
        errorMessage += ' with this NIN';
    } else if (existingUser.email === email) {
        errorMessage += ' with this Email';
    }
    errorMessage += " already exists!";
    return res.status(400).json({ error: errorMessage });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    first_name, 
    last_name, 
    NIN, 
    email, 
    password: hashedPassword
  });

  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  res.status(201).json({
    message: 'User created successfully',
    data: userObj
  });
});

module.exports = signUpUser 
