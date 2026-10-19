const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name:  { type: String, required: [true, 'Team name is required'], trim: true },
  sport: { type: String, required: [true, 'Sport is required'], trim: true },
  coach: { type: String, required: [true, 'Coach name is required'], trim: true },
  city:  { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
