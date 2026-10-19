require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Team = require('./models/Team');
const Player = require('./models/Player');
const Match = require('./models/Match');
const crudRouter = require('./routes/crud');

const app = express();
app.use(cors());
app.use(express.json());

// REST API routes
app.use('/api/teams', crudRouter(Team));
app.use('/api/players', crudRouter(Player, 'team'));
app.use('/api/matches', crudRouter(Match, 'teamA teamB'));

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(e => e.message).join(', ');
    return res.status(400).json({ message });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid ID' });
  res.status(500).json({ message: err.message || 'Server error' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch(err => console.error('DB connection failed:', err.message));
