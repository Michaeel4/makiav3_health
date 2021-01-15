import express = require('express');
import { requireToken } from '../middleware/auth.middleware';
import { LocationModel } from '../models/location.model';
import { getLocationCollection } from './mongodb.service';
import { v4 as uuid} from 'uuid';

const locationRoutes = express.Router();

locationRoutes.post('/location', requireToken, async (req, res) => {
   const location: LocationModel = req.body;
   await getLocationCollection().insertOne({
       ...location,
       _id: uuid()
   });
   res.status(200).end();
});

locationRoutes.get('/location', requireToken, async (req, res) => {
    res.json(await getLocationCollection().find({}).toArray());
});

locationRoutes.put('/location', requireToken, async (req, res) => {
    const location: LocationModel = req.body;
    await getLocationCollection().replaceOne({_id: location._id}, location);
    res.status(200).end();
});

locationRoutes.delete('/location/:id', requireToken, async (req, res) => {
    await getLocationCollection().deleteOne({_id: req.params.id});
    res.status(200).end();
});


export {locationRoutes};
