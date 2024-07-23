// middleware/authenticateJWT.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                console.log('Token verification failed:', err);
                return res.status(403).json({ message: 'Forbidden' });
            }
            console.log('Token verified successfully:', user);
            req.user = user; // Ensure the user is set correctly
            next();
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authenticateJWT;