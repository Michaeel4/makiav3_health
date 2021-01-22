import express = require('express');
import { PingModel } from '../models/ping.model';
import { getDeviceCollection } from './mongodb.service';
import { DeviceModel } from '../models/device.model';
import { DeviceStatus } from '../models/device-status.enum';

const clientRoutes = express.Router();



clientRoutes.post('/ping', async (req, res) => {
    const ping: PingModel = req.body;
    const device = await getDeviceCollection().findOne({_id: ping.id});
    if (device) {
        await getDeviceCollection().updateOne({_id: ping.id}, {
            $set: {
                lastPing: ping
            }
        });

        res.json(ping);

    } else {
        res.sendStatus(403);
    }



});





export {clientRoutes};
