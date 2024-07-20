const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
  type: {
    type: String,
    enum: ['station', 'hospital'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming there's a User model to reference
    required: true
  },
  time: {
    type: Date,
    required: true,
    default: Date.now
  },
  condition: {
    type: String,
    enum: ['attendedTo', 'attendingTo', 'unattendedTo'],
    required: true,
    default: 'unattendedTo'
  },

  location: {
    type: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    required: true
  },
  e_type: {
    type: String,
    required: [true, "Emergency Type must be available!"]
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Issue', issueSchema);