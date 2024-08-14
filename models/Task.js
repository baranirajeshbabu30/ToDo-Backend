const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  progress: { type: String, enum: ['active', 'completed'], default: 'active' }
});

module.exports = mongoose.model('Task', TaskSchema);
