import express = require('express');
import { authenticate } from '../middleware/auth.middleware';
import { CredentialsModel } from '../models/credentials.model';

const authRoutes = express.Router();

authRoutes.post('/login', (req, res) => {
    const credentials: CredentialsModel = req.body;
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
