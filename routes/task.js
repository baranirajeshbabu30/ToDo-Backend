const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

router.post('/todo', async (req, res) => {
    const { title, description, category, progress } = req.body;
    const userId = req.userId; 
  
    if (!title || !description || !category || !progress) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const task = new Task({ title, description, user: userId, category, progress });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
router.get('/todo', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put('/todo/:id', async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.userId) {
      return res.status(403).send('Forbidden');
    }
    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed !== undefined ? completed : task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete('/todo/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.userId) {
      return res.status(403).send('Forbidden');
    }
    await task.remove();
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
