// models/OrganizationsModel.js
const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  location: {
    type: String,
    required: [true, "location is required"],
  },
  type: {
    type: String,
    required: [true, "type is required"],
    enum: {
      values: ['station', "hospital"],
      message: '{VALUE} is not a valid organization type',
    },
  },
  customId: {
    type: String,
    unique: true,
    required: [true, "custom ID is required"],
  },
  latitude:{
    type: String,
    unique: true,
    required: [true, "longitude is required"],
  },
  longitude: {
    type: String,
    unique: true,
    required: [true, "latitude is required"],
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


const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;
