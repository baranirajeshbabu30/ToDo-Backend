require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');

const PORT = process.env.PORT || 5001;
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));
app.use(express.json());

app.options('*', cors(corsOptions));

const connectToMongoDB = () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('MongoDB URI is missing from environment variables.');
    process.exit(1);
  }

  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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

app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);

app.get('/author', (req, res) => {
  res.json({
    name: 'Barani',
    github: 'https://github.com/baranirajeshbabu30/ToDo-Backend'
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
