const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Load the secret key from environment variables
const SECRET_KEY = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
      const { email, password, confirmPassword } = req.body;

      // Check if passwords match
      if (password !== confirmPassword) {
          return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
          return res.status(409).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user with a default role
      const newUser = await User.create({
          email,
          password: hashedPassword,
          role: 'user' // Set a default role for new users
      });

      console.log('User registered successfully:', newUser); // Log user registration
      res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
      console.error('Error registering user:', error);
      if (error.name === 'SequelizeValidationError') {
          res.status(400).json({ message: error.errors[0].message });
      } else {
          res.status(500).json({ message: 'Internal server error' });
      }
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    console.log('Token generated:', token); // Log the generated token
    res.json({ token, userId: user.id, role: user.role });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
};

exports.verify = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : req.query.Authorization;

  if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
          console.error('Token verification error:', err);
          return res.status(401).json({ message: 'Invalid token' });
      }

      console.log('Token verified successfully:', decoded); // Log token verification
      res.status(200).json({ message: 'Token is valid', user: decoded });
  });
};