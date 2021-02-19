import { requireUser } from '../../middleware/auth.middleware';
import { DeviceModel } from '../../models/device.model';
import { UserModel } from '../../models/user.model';
import { config } from '../../config';
import fs from 'fs';
import express from 'express';
import { createDevice, getAllowedDevices, getDeviceById, isAllowedForDevice, rebootDevice } from './device.controller';

const deviceRoutes = express.Router();

deviceRoutes.post('/device', requireUser, async (req, res) => {
    const device: DeviceModel = req.body;
    const user: UserModel = req.user as UserModel;
    if (await isAllowedForDevice(user, device)) {
        await createDevice(device);
        res.status(200).end();
    } else {
        res.sendStatus(403);
    }


});

deviceRoutes.get('/device', requireUser, async (req, res) => {
    const user: UserModel = req.user as UserModel;
    const allowedDevices = await getAllowedDevices(user);
    res.json(allowedDevices);
});

deviceRoutes.get('/device/:id/image', requireUser, async (req, res) => {
    const user: UserModel = req.user as UserModel;

    const device = await getDeviceById(req.params.id);
    if (user && device && await isAllowedForDevice(user, device)) {
        const path = `${config.uploadDirs.health}/${req.params.id}.jpg`;
        try {
            await fs.promises.access(path);

            res.contentType('image/jpg');
            res.sendFile(path);

        } catch {
            res.status(400).end();
        }
    } else {
        res.sendStatus(403);
    }


});

deviceRoutes.post('/device/:id/reboot', requireUser, async (req, res) => {
    const user: UserModel = req.user as UserModel;
    const device = await getDeviceById(req.params.id);
    if (user && device && await isAllowedForDevice(user, device)) {
        await rebootDevice(device);
        res.status(200).end();
    } else {
        res.status(403).end();
    }


});


export { deviceRoutes };
