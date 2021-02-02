import express = require('express');
import { requireAdmin, requireUser } from '../middleware/auth.middleware';
import { LocationModel } from '../models/location.model';
import { getLocationCollection } from './mongodb.service';
import { v4 as uuid} from 'uuid';
import { UserModel } from '../models/user.model';

export function isAllowedForLocation(user: UserModel, location: LocationModel) {
        return user.admin || user.allowedLocations.findIndex(allowed => {
            return location._id === allowed
        }) > -1;
}


const locationRoutes = express.Router();

locationRoutes.post('/location', requireAdmin, async (req, res) => {
   const location: LocationModel = req.body;
   await getLocationCollection().insertOne({
       ...location,
       _id: uuid()
   });
   res.status(200).end();
});

locationRoutes.get('/location', requireUser, async (req, res) => {
    const user: UserModel = req.user as UserModel;

    if (user) {
        const locations: LocationModel[] = await getLocationCollection().find({}).toArray();
        const allowedLocations = locations.filter(location => isAllowedForLocation(user, location));
        res.json(allowedLocations);
    } else {
        res.sendStatus(403);
    }


});


export {locationRoutes};
