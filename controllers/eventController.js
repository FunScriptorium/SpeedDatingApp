const { User, UserEvent } = require('../models');
const Event = require('../models/event');  // Import Event separately if it's not in the index file

exports.createEvent = async (req, res) => {
    console.log('createEvent called with user:', req.user);
    if (req.user.role !== 'host') {
        console.log('Access denied for user:', req.user);
        return res.status(403).json({ error: 'Behörighet saknas' });
    }
    const { date, maxParticipants, minAge, maxAge, address, startTime, endTime } = req.body;
    console.log('Creating event with data:', req.body);
    try {
        const newEvent = await Event.create({
            date,
            maxParticipants,
            minAge,
            maxAge,
            address,
            startTime,
            endTime
        });
        console.log('Event created successfully:', newEvent);
        res.status(201).json({ message: 'Event created successfully!' });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            attributes: ['id', 'date', 'maxParticipants', 'minAge', 'maxAge', 'address', 'startTime', 'endTime'],
        });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

exports.registerForEvent = async (req, res) => {
    console.log('registerForEvent called with user:', req.user);
    const { eventId } = req.params;
    try {
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const participantCount = await UserEvent.count({ where: { eventId } });
        if (participantCount >= event.maxParticipants) {
            return res.status(400).json({ error: 'Event is full' });
        }

        const user = await User.findByPk(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await UserEvent.create({
            userId: user.id,
            eventId: event.id,
            choice: null
        });

        console.log('Registered for event successfully');
        res.status(201).json({ message: 'Registered for event successfully!' });
    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getRegistrationStatus = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.userId; // Ensure you use `userId` correctly here

        console.log('Checking registration status for userId:', userId, 'and eventId:', eventId);

        const registration = await UserEvent.findOne({
            where: { userId, eventId }
        });

        res.json({ isRegistered: !!registration });
    } catch (error) {
        console.error('Error checking registration status:', error);
        res.status(500).json({ error: 'An error occurred while checking registration status' });
    }
};

exports.makeChoice = async (req, res) => {
    console.log('makeChoice called with user:', req.user);
    const { eventId } = req.params;
    const { choice } = req.body;
    try {
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const user = await User.findByPk(req.user.userId);
        const userEvent = await event.getUsers({ where: { id: user.id } });
        if (userEvent.length === 0) {
            return res.status(404).json({ error: 'User not registered for this event' });
        }
        await event.removeUser(user);
        await event.addUser(user, { through: { choice } });
        console.log('Choice saved successfully');
        res.json({ message: 'Choice saved successfully!' });
    } catch (error) {
        console.error('Error saving choice:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getMatches = async (req, res) => {
    console.log('getMatches called with eventId:', req.params.eventId);
    const { eventId } = req.params;
    try {
        const event = await Event.findByPk(eventId, {
            include: [{ model: User, through: { attributes: ['choice'] } }]
        });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const participants = event.Users;
        const matches = [];
        for (let i = 0; i < participants.length; i++) {
            for (let j = i + 1; j < participants.length; j++) {
                const choice1 = participants[i].UserEvents.choice;
                const choice2 = participants[j].UserEvents.choice;
                if (choice1 === 'Ja' && choice2 === 'Ja') {
                    matches.push({ user1: participants[i].username, user2: participants[j].username });
                } else if (choice1 === 'Verkar intressant' && choice2 === 'Verkar intressant') {
                    matches.push({ user1: 'Verkar intressant', user2: 'Verkar intressant' });
                }
            }
        }
        console.log('Matches found:', matches);
        res.json(matches);
    } catch (error) {
        console.error('Error getting matches:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [{ 
                model: User, 
                attributes: ['id'], 
                through: { attributes: [] } 
            }]
        });
        if (event) {
            const eventData = event.toJSON();
            eventData.currentParticipants = eventData.Users.length;
            delete eventData.Users;
            res.json(eventData);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
};

exports.getParticipants = async (req, res) => {
    const eventId = req.params.id;
    try {
        const event = await Event.findByPk(eventId, {
            include: {
                model: User,
                through: {
                    attributes: []
                },
                attributes: ['id', 'email'] // Adjust to the actual fields you have
            }
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const participants = event.Users.map(user => ({
            id: user.id,
            name: user.email // Adjust to the actual fields you have
        }));

        res.json(participants);
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ error: 'Failed to fetch participants' });
    }
};