const app = require('./app');
const mongoose = require('mongoose');

// Enable debug mode in development
if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}

mongoose.connect('mongodb://localhost/bugtracker')
  .then(() => {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });