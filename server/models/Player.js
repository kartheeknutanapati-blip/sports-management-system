const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name:     { type: String, required: [true, 'Player name is required'], trim: true },
  age:      { type: Number, required: [true, 'Age is required'], min: [5, 'Age must be at least 5'] },
  position: { type: String, trim: true },
  jerseyNo: { type: Number, min: 0 },
  team:     { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: [true, 'Team is required'] }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
