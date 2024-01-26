const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  player_name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  health: {
    type: Number,
    required: true,
    min: [0, 'Health should be a positive number or zero'],
    validate: {
      validator: Number.isInteger,
      message: 'Health should be an integer',
    },
  },
  strength: {
    type: Number,
    required: true,
    min: [0, 'Strength should be a positive number or zero'],
    validate: {
      validator: Number.isInteger,
      message: 'Strength should be an integer',
    },
  },
  attack: {
    type: Number,
    required: true,
    min: [0, 'Attack should be a positive number or zero'],
    validate: {
      validator: Number.isInteger,
      message: 'Attack should be an integer',
    },
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);
