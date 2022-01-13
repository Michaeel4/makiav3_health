import { requireAdmin, requireUser } from '../../../middleware/auth.middleware';
import { LocationModel } from '../../../models/health/location.model';
import { UserModel } from '../../../models/health/user.model';
import express from 'express';
import { createLocation, getAllowedLocations, updateLocation } from './location.controller';

const locationRoutes = express.Router();

locationRoutes.post('/location', requireAdmin, async (req, res) => {
    const location: LocationModel = req.body;
    await createLocation(location);
    res.status(200).end();
});

locationRoutes.put('/location', requireAdmin, async (req, res) => {
    const location: LocationModel = req.body;
    await updateLocation(location);
    res.status(200).end();
});


locationRoutes.get('/location', requireUser, async (req, res) => {
    const user: UserModel = req.user as UserModel;

    if (user) {

        res.json(await getAllowedLocations(user));
    } else {
        res.sendStatus(403);
    }
});


export { locationRoutes };
