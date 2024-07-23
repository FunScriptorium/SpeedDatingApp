const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authenticateJWT = require('../middleware/authenticateJWT');

router.post('/events', authenticateJWT, eventController.createEvent);
router.get('/events', eventController.getAllEvents);
router.post('/events/:eventId/register', authenticateJWT, eventController.registerForEvent);
router.get('/events/:id/registration-status', authenticateJWT, eventController.getRegistrationStatus);
router.post('/events/:eventId/choice', authenticateJWT, eventController.makeChoice);
router.get('/events/:eventId/matches', authenticateJWT, eventController.getMatches);
router.get('/events/:id', authenticateJWT, eventController.getEvent);
router.get('/events/:id/participants', authenticateJWT, eventController.getParticipants); // Ensure this line exists

module.exports = router;