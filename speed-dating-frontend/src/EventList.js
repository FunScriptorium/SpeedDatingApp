import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const defaultImageUrl = '/eventbild.jpg'; // Path relative to the public folder

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:3000/api/events', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(response.data); // Log response data
                setEvents(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching events:', error);
                setError('Failed to fetch events. Please try again.');
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleBookSpot = (id) => {
        navigate(`/event/${id}`);
    };

    if (loading) {
        return (
            <Container maxWidth="sm">
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Container>
        );
    }

    if (events.length === 0) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h4" align="center" gutterBottom>
                    No Events Available
                </Typography>
                <Typography variant="body1" align="center">
                    There are currently no events. Please create an event.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    href="/create-event"
                    style={{ marginTop: '16px' }}
                >
                    Create Event
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" gutterBottom>
                Events
            </Typography>
            <Grid container spacing={4}>
                {events.map((event) => (
                    <Grid item key={event.id} xs={12} sm={6} md={6}>
                        <Card sx={{ maxWidth: 400 }}>
                            <CardMedia
                                component="img"
                                alt="Event image"
                                height="200"
                                image={defaultImageUrl}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div">
                                    Speeddating {moment(event.date).format('YYYY-MM-DD')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Address: {event.address || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Time: {event.startTime ? moment(event.startTime, 'HH:mm:ss').format('HH:mm') : 'N/A'} - {event.endTime ? moment(event.endTime, 'HH:mm:ss').format('HH:mm') : 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Age: {event.minAge} - {event.maxAge} years
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ color: 'red' }}>
                                    {event.maxParticipants ? (event.maxParticipants - (event.currentParticipants || 0)) : 'N/A'} spots left!
                                </Typography>
                            </CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <Button size="small" variant="contained" onClick={() => handleBookSpot(event.id)}>Boka plats</Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default EventList;