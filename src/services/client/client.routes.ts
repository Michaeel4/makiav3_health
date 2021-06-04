import { PingModel } from '../../models/ping.model';
import { DeviceModel } from '../../models/device.model';
import { getDeviceCollection } from '../mongodb.service';
import { config } from '../../config';
import express from 'express';
import { imagesForDevice, updateDevicePing } from './client.controller';
import { getDeviceById } from '../device/device.controller';

const clientRoutes = express.Router();



clientRoutes.post('/ping', async (req, res) => {
    const ping: PingModel = req.body;
    const device: DeviceModel | null = await getDeviceById(ping.id);
    if (device) {
        await updateDevicePing(ping, device);

        res.json(device.lastPing); // send back old ping

    } else {
        res.status(403).end();
    }
});

clientRoutes.post('/device/:id/image', async (req, res) => {
    const image = req.files?.image;
    const device: DeviceModel | null = await getDeviceById(req.params.id);

    if (image && !Array.isArray(image) && device?._id) {
        imagesForDevice[device._id] = image.data;
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});




export {clientRoutes};
