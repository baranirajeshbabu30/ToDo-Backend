const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./netlify/functions/auth');
const taskRoutes = require('./netlify/functions/task');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');

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

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];


  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey', (err, decoded) => {
    if (err) {
      console.error('Token Verification Error:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.userId = decoded.userId;
    next();
  });
};




app.use('/api/auth', authRoutes);
app.use('/api/task',  taskRoutes);  


app.get('/author', (req, res) => {
  res.json({
    name: 'Barani',
    github: 'https://github.com/baranirajeshbabu30/ToDo-Backend'
  });
});

app.listen(PORT, () => (`Server running on port ${PORT}`));
