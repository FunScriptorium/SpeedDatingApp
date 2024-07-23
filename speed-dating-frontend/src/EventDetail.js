import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Container, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import axios from 'axios';
import moment from 'moment';

const defaultImageUrl = '/eventbild.jpg'; // Path relative to the public folder

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventDetails = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:3000/api/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvent(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching event details:', error);
                setError('Failed to fetch event details. Please try again.');
                setLoading(false);
            }
        };

        const fetchRegistrationStatus = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:3000/api/events/${id}/registration-status`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsRegistered(response.data.isRegistered);
            } catch (error) {
                console.error('Error fetching registration status:', error);
            }
        };

        fetchEventDetails();
        fetchRegistrationStatus();
    }, [id]);

    const handleRegister = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:3000/api/events/${id}/register`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsRegistered(true);
        } catch (error) {
            console.error('Error registering for event:', error);
            setError('Failed to register for the event. Please try again.');
        }
    };

    const handleJoinMatchmaking = () => {
        navigate(`/event/${id}/matchmaking`);
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

    if (!event) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h6" color="error">
                    Event not found
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
                <CardMedia
                    component="img"
                    alt="Event image"
                    height="200"
                    image={defaultImageUrl}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: 2 }}>
                    {isRegistered ? (
                        <>
                            <Button size="small" variant="contained" disabled>
                                Registrerad
                            </Button>
                            <Button size="small" variant="contained" onClick={handleJoinMatchmaking} sx={{ ml: 2 }}>
                                Delta
                            </Button>
                        </>
                    ) : (
                        <Button size="small" variant="contained" onClick={handleRegister}>
                            Boka plats
                        </Button>
                    )}
                </Box>
            </Card>
        </Container>
    );
};

export default EventDetail;