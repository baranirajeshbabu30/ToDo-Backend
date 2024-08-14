const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const User = require('../models/User');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
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
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);

        const user = new User({
            userId,
            username,
            password: hashedPassword,
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
    const { useremail, password } = req.body;

    if (!useremail || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ useremail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatching = await user.comparePassword(password);
        if (!isMatching) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.userId, useremail: user.useremail }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Error logging in' });
    }
});


module.exports = router;
