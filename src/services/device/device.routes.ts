import { requireUser } from '../../middleware/auth.middleware';
import { DeviceModel } from '../../models/device.model';
import { UserModel } from '../../models/user.model';
import { config } from '../../config';
import fs from 'fs';
import express from 'express';
import {
    calibrateDevice,
    createDevice,
    getAllowedDevices,
    getDeviceById,
    isAllowedForDevice,
    rebootDevice
} from './device.controller';
import { imagesForDevice } from '../client/client.controller';

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
    if (user && device?._id && await isAllowedForDevice(user, device)) {
        try {

            const buffer = imagesForDevice[device._id];
            if (buffer) {
                res.contentType('image/jpg');
                res.setHeader('Content-Length', buffer.length);
                res.setHeader( "Cache-Control", "no-cache, no-store, must-revalidate")

                res.send(buffer);
                res.status(200).end();
            } else {
                res.status(204).send();
            }


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
deviceRoutes.post('/device/:id/calibrate', requireUser, async (req, res) => {
    const user: UserModel = req.user as UserModel;
    const device = await getDeviceById(req.params.id);
    if (user && device && await isAllowedForDevice(user, device)) {
        await calibrateDevice(device);
        res.status(200).end();
    } else {
        res.status(403).end();
    }


});


export { deviceRoutes };
