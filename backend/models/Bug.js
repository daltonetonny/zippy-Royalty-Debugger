const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    minlength: [5, 'Title must be at least 5 characters'],
    trim: true
  },
  status: { 
    type: String, 
    default: 'open',
    enum: {
      values: ['open', 'in-progress', 'resolved'],
      message: 'Invalid status value'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bug', bugSchema);