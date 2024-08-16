const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: String, ref: 'User', required: true },
  category: { type: String, required: true },
  duedate: { type: Date, required: true },

  progress: { type: String, enum: ['active', 'completed'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
},{ versionKey: false });

module.exports = mongoose.model('Task', TaskSchema);
