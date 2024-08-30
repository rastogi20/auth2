const express = require('express');
const router = express.Router();
// const User = require('../models/User');
const User = require("../models/user");

const { createToken } = require('../services/auth');

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.status(201).json({ message: 'User created' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = createToken(user);
  res.cookie('token', token, { httpOnly: true }).json({ message: 'Logged in' });
});

router.get('/profile', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json({ user: req.user });
});

module.exports = router;
