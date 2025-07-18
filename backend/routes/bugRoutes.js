const express = require('express');
const Bug = require('../models/Bug');
const router = express.Router();

// Create a bug
router.post('/', async (req, res, next) => {
  try {
    const bug = new Bug(req.body);
    await bug.save();
    res.status(201).json(bug);
  } catch (err) {
    next(err);
  }
});

// Get all bugs
router.get('/', async (req, res, next) => {
  try {
    const bugs = await Bug.find().sort({ createdAt: -1 });
    res.json(bugs);
  } catch (err) {
    next(err);
  }
});

// Update bug status
router.put('/:id', async (req, res, next) => {
  try {
    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    
    res.json(bug);
  } catch (err) {
    next(err);
  }
});

// Delete a bug
router.delete('/:id', async (req, res, next) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);
    
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;