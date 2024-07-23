import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container } from '@mui/material';
import axios from 'axios';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import EventList from './EventList';
import CreateEvent from './CreateEvent';
import EventDetail from './EventDetail';
import PrivateRoute from './PrivateRoute';
import Matchmaking from './Matchmaking';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/api/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.status === 200) {
            setIsAuthenticated(true);
            console.log('Token verified successfully:', response.data);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Token verification error:', error);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      }
    };
    verifyToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/events">
                Event List
              </Button>
              <Button color="inherit" component={Link} to="/create-event">
                Create Event
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<PrivateRoute element={<EventList />} isAuthenticated={isAuthenticated} />} />
          <Route path="/create-event" element={<PrivateRoute element={<CreateEvent />} isAuthenticated={isAuthenticated} />} />
          <Route path="/event/:id" element={<PrivateRoute element={<EventDetail />} isAuthenticated={isAuthenticated} />} />
          <Route path="/event/:id/matchmaking" element={<PrivateRoute element={<Matchmaking />} isAuthenticated={isAuthenticated} />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;