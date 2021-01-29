import express = require('express');
import { requireToken } from '../middleware/auth.middleware';
import { getDeviceCollection } from './mongodb.service';
import { v4 as uuid } from 'uuid';
import { locationRoutes } from './location.service';
import { DeviceModel } from '../models/device.model';
import fs from 'fs';
import { config } from '../config';
import { CommandModel } from '../models/ping.model';

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

deviceRoutes.delete('/device/:id', requireToken, async (req, res) => {
    await getDeviceCollection().deleteOne({_id: req.params.id});
    res.status(200).end();
});

deviceRoutes.get('/device/:id/image', requireToken, async (req, res) => {
    const path = `${config.uploadDir}/${req.params.id}.jpg`;
   try {
       await fs.promises.access(path);

       res.contentType('image/jpg');
       res.sendFile(path);

   } catch {
       res.status(400).end();
   }
});

deviceRoutes.post('/device/:id/reboot', requireToken, async (req, res) => {
    await getDeviceCollection().updateOne({_id: req.params.id}, {
        $set: {
            "lastPing.command": CommandModel.REBOOT
        }
    });
    res.status(200).end();

});


export {deviceRoutes};
