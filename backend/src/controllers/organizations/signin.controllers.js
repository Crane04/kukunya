const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require('express-async-handler');
const Organizations = require('../../models/OrganizationsModel'); // Adjust the path as needed
require('dotenv').config();

const app_sk = process.env.APP_SK;

const signInOrganizations = asyncHandler(async (req, res) => {
  const { customId, password } = req.body;
  
  if (!customId || !password) {
    return res.status(400).json({
      message: 'All fields are required'
    });
  }

  const organization = await Organizations.findOne({ customId });
  
  if (!organization) {
    return res.status(404).json({ message: 'Organization not found' });
  }

  // Correctly compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, organization.password);
  
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: organization._id }, app_sk, { expiresIn: '30d' });

  res.cookie("jwt", `${token}`, { maxAge: 86400000000000, httpOnly: false });

  return res.json({
    message: 'Login successful',
    token,
    organization: organization.customId
  });
});

module.exports = signInOrganizations;
