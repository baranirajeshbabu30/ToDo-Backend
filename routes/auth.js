const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const generateToken = require('../utils/generateToken'); 

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const { username, password, useremail } = req.body;

    if (!username || !password || !useremail) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ useremail });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const userId = uuidv4();

        const user = new User({
            userId,
            username,
            password, 
            useremail
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ error: 'Error creating user' });
    }
});

router.post('/login', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers');

    const { useremail, password } = req.body;

    if (!useremail || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ useremail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (password !== user.password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.status(200).json({ token, userId: user.userId, useremail });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Error logging in' });
    }
});

module.exports = router;