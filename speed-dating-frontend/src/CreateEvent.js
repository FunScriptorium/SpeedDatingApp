import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Slider, Box, Grid } from '@mui/material';
import { createEvent } from './api';

const CreateEvent = () => {
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [address, setAddress] = useState('');
    const [maxParticipants, setMaxParticipants] = useState(20);
    const [ageRange, setAgeRange] = useState([18, 80]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleMaxParticipantsChange = (event, newValue) => {
        setMaxParticipants(newValue);
    };

    const handleAgeRangeChange = (event, newValue) => {
        setAgeRange(newValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const eventData = {
                name: `Speeddating ${date}`,
                date,
                startTime,
                endTime,
                address,
                maxParticipants,
                minAge: ageRange[0],
                maxAge: ageRange[1],
            };
            await createEvent(eventData);
            setSuccess('Event created successfully!');
            // Clear the form
            setDate('');
            setStartTime('');
            setEndTime('');
            setAddress('');
            setMaxParticipants(20);
            setAgeRange([18, 80]);
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setError('Behörighet saknas');
            } else {
                setError(error.message || 'Error creating event');
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom>
                Create Event
            </Typography>
            {error && (
                <Typography color="error" align="center" gutterBottom>
                    {error}
                </Typography>
            )}
            {success && (
                <Typography color="success" align="center" gutterBottom>
                    {success}
                </Typography>
            )}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Start Time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="End Time"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>
                <TextField
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
                <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography gutterBottom>Max Participants</Typography>
                    <Slider
                        value={maxParticipants}
                        onChange={handleMaxParticipantsChange}
                        valueLabelDisplay="auto"
                        step={2}
                        marks
                        min={20}
                        max={100}
                    />
                </Box>
                <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography gutterBottom>Age Range</Typography>
                    <Slider
                        value={ageRange}
                        onChange={handleAgeRangeChange}
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={18}
                        max={80}
                    />
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Create
                </Button>
            </form>
        </Container>
    );
};

export default CreateEvent;