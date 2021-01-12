import express = require('express');
import { authenticate, Credentials } from '../middleware/auth.middleware';

const authRoutes = express.Router();

authRoutes.post('/login', (req, res) => {
    const credentials: Credentials = req.body;
    const token = authenticate(credentials);
    if (token) {
        res.json({
            token
        })
    } else {
        res.status(403).end();
    }
});


export {authRoutes};
