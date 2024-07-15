// controllers/authController.js
const Organizations = require('../../models/OrganizationsModel'); // Adjust the path as needed
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

const signUpOrganizations = asyncHandler(async (req, res) => {
  const { name, location, type, customId, email, password, latitude, longitude } = req.body;

  if (!name || !location || !type || !customId || !email || !password, !latitude, !longitude) {
    return res.status(400).json({
        message: 'All fields are required'
    });
  }

  const existingOrganization = await Organizations.findOne({ $or: [{ customId }, { email }] });
  if (existingOrganization) {
    let errorMessage = 'Organization';
    if (existingOrganization.customId === customId) {
        errorMessage += ' with this custom ID';
    } else if (existingOrganization.email === email) {
        errorMessage += ' with this Email';
    }
    errorMessage += " already exists!";
    return res.status(400).json({ error: errorMessage });
}


  const hashedPassword = await bcrypt.hash(password, 10);

  const organization = new Organizations({
    name, 
    location, 
    type, 
    customId, 
    email, 
    password: hashedPassword,
    latitude,
    longitude
  });

  await organization.save();

  const organizationObj = organization.toObject();
  delete organizationObj.password;

  res.status(201).json({
    message: 'Organization created successfully',
    data: organizationObj
  });
});

module.exports = signUpOrganizations 
