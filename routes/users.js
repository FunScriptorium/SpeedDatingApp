// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../middleware/authenticateJWT');

// Route to get user details
router.get('/users/:id', authenticateJWT, userController.getUser);

// Route to update user details
router.put('/users/:id', authenticateJWT, userController.updateUser);

// Route to update user role to host
router.put('/users/:id/role', authenticateJWT, userController.updateUserRole);

module.exports = router;