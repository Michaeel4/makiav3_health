import express = require('express');
import { PingModel } from '../models/ping.model';
import { getDeviceCollection } from './mongodb.service';
import { DeviceModel } from '../models/device.model';
import { DeviceStatus } from '../models/device-status.enum';
import { config } from '../config';

const clientRoutes = express.Router();



clientRoutes.post('/ping', async (req, res) => {
    const ping: PingModel = req.body;
    const device: DeviceModel | null = await getDeviceCollection().findOne({_id: ping.id});
    if (device) {
        await getDeviceCollection().updateOne({_id: ping.id}, {
            $set: {
                lastPing: ping
            }
        });

        res.json(device.lastPing); // send back old ping

    } else {
        res.status(403).end();
    }
});

clientRoutes.post('/device/:id/image', async (req, res) => {
    const image = req.files?.image;
    const device: DeviceModel | null = await getDeviceCollection().findOne({_id: req.params.id});

    if (image && !Array.isArray(image) && device) {
        await image.mv(`${config.uploadDir}/${device._id}.jpg`);
        res.status(200).end();
    } else {
        res.status(400).end();
    }


})




export {clientRoutes};
