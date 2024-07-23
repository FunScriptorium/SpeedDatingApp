import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Adjust the URL if your backend server is running on a different port

// Set up the default configuration for axios
axios.defaults.baseURL = API_URL;

// Function to register a new user
export const registerUser = async (userData) => {
    try {
        const response = await axios.post('/api/register', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error registering user');
    }
};

// Function to log in a user
export const loginUser = async (userData) => {
    try {
        const response = await axios.post('/api/login', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error logging in');
    }
};

// Function to create a new event
export const createEvent = async (eventData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/events', eventData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error creating event');
    }
};

// Function to get all events
export const getEvents = async () => {
    try {
        const response = await axios.get('api/events');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error fetching events');
    }
};

// Function to register for an event
export const registerForEvent = async (eventId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`/api/events/${eventId}/register`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error registering for event');
    }
};

// Function to submit choices for an event
export const submitChoice = async (eventId, choice) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`/api/events/${eventId}/choice`, { choice }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error submitting choice');
    }
};
