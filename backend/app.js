const express = require('express');
const bugRoutes = require('./routes/bugRoutes');
const app = express();

app.use(express.json());
app.use('/api/bugs', bugRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;