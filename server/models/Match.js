const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  teamA:  { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: [true, 'Team A is required'] },
  teamB:  { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: [true, 'Team B is required'] },
  date:   { type: Date, required: [true, 'Match date is required'] },
  venue:  { type: String, required: [true, 'Venue is required'], trim: true },
  scoreA: { type: Number, default: 0, min: 0 },
  scoreB: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['upcoming', 'completed'], default: 'upcoming' }
}, { timestamps: true });

// Validation: a team cannot play against itself
matchSchema.pre('validate', function (next) {
  if (this.teamA && this.teamB && this.teamA.equals(this.teamB)) {
    return next(new Error('Team A and Team B must be different'));
  }
  next();
});

module.exports = mongoose.model('Match', matchSchema);
