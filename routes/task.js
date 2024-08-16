const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User'); 
const router = express.Router();
const mongoose = require('mongoose');

router.post('/todo', async (req, res) => {
  const { title, description, category, progress, userId,duedate } = req.body; 


  if (!title || !description || !category || !progress || !userId || !duedate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const task = new Task({ title, description, userId, category, progress,duedate });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error saving task:', error);
    res.status(400).send(error.message);
  }
});


router.get('/todo/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const tasks = await Task.find({ userId }); 
    res.status(200).json(tasks); 
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send(error.message);
  }
});


router.put('/todo/:id', async (req, res) => {
  const { id } = req.params;  
  const { title, description, progress,category } = req.body;  

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).send('Task not found');
    }

   

    task.title = title || task.title;
    task.description = description || task.description;
    task.progress = progress || task.progress;
    task.category = category || task.category;


    await task.save();
    res.json(task);  
  } catch (error) {
    console.error(error);  
    res.status(400).send(error.message);  
  }
});



router.delete('/todo/:id', async (req, res) => {
  const { id } = req.params;


  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid ID format');
  }

  try {
    const result = await Task.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).send('Task not found');
    }

    res.status(204).send();  
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).send('Internal Server Error');
  }
});




module.exports = router;
