const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

require('dotenv').config(); 

const app = express();
app.use(cors());
app.use(express.json()); 

const connectToMongoDB = () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('MongoDB URI is missing from environment variables.');
    process.exit(1);
  }

  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 50000
  });

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });
};

connectToMongoDB();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/task', authenticateToken, taskRoutes);

app.get('/author', (req, res) => {
  res.json({
    name: 'BaraniS',
    github: 'https://github.com/yourusername/task-management-system'
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


