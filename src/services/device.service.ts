import express = require('express');
import { requireToken } from '../middleware/auth.middleware';
import { getDeviceCollection } from './mongodb.service';
import { v4 as uuid } from 'uuid';
import { locationRoutes } from './location.service';
import { DeviceModel } from '../models/device.model';

const deviceRoutes = express.Router();

deviceRoutes.post('/device', requireToken, async (req, res) => {
    const device: DeviceModel = req.body;
    await getDeviceCollection().insertOne({
        ...device,
        _id: uuid()
    });
    res.status(200).end();
});

deviceRoutes.get('/device', requireToken, async (req, res) => {
    res.json(await getDeviceCollection().find({}).toArray());
});

deviceRoutes.put('/device', requireToken, async (req, res) => {
    const device: DeviceModel = req.body;
    await getDeviceCollection().replaceOne({_id: device._id}, device);
    res.status(200).end();
});

locationRoutes.delete('/device/:id', requireToken, async (req, res) => {
    await getDeviceCollection().deleteOne({_id: req.params.id});
    res.status(200).end();
});

export {deviceRoutes};
