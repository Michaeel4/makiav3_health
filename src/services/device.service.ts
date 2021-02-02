import express = require('express');
import { requireUser } from '../middleware/auth.middleware';
import { getDeviceCollection, getLocationCollection } from './mongodb.service';
import { v4 as uuid } from 'uuid';
import { isAllowedForLocation, locationRoutes } from './location.service';
import { DeviceModel } from '../models/device.model';
import fs from 'fs';
import { config } from '../config';
import { CommandModel } from '../models/ping.model';
import { UserModel } from '../models/user.model';

export async function isAllowedForDevice(user: UserModel, device: DeviceModel): Promise<boolean> {
    const location = await getLocationCollection().findOne({
        _id: device.locationId
    });
    const allowed = isAllowedForLocation(user, location);
    return location && allowed
}

const deviceRoutes = express.Router();

deviceRoutes.post('/device', requireUser, async (req, res) => {
    const device: DeviceModel = req.body;
    const user: UserModel = req.user as UserModel;
    if (await isAllowedForDevice(user, device)) {
        await getDeviceCollection().insertOne({
            ...device,
            _id: uuid()
        });
        res.status(200).end();
    } else {
        res.sendStatus(403);
    }


});

deviceRoutes.get('/device', requireUser, async (req, res) => {
    const user: UserModel = req.user as UserModel;
    const devices: DeviceModel[] = await getDeviceCollection().find({}).toArray();
    if (user) {
        const allowedDevices: DeviceModel[] = (await Promise.all(devices.map(async device => {
            return await isAllowedForDevice(user, device) ? device : null;
        }))).filter(d => d) as DeviceModel[];
        
        res.json(allowedDevices);
    } else
        res.sendStatus(403)

});

deviceRoutes.get('/device/:id/image', requireUser, async (req, res) => {
    const user: UserModel = req.user as UserModel;

    const device = await getDeviceCollection().findOne({_id: req.params.id});
    if (user && device && await isAllowedForDevice(user, device)) {
        const path = `${config.uploadDir}/${req.params.id}.jpg`;
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
    const device = await getDeviceCollection().findOne({_id: req.params.id});
    if (user && device && await isAllowedForDevice(user, device)) {
        await getDeviceCollection().updateOne({_id: req.params.id}, {
            $set: {
                "lastPing.command": CommandModel.REBOOT
            }
        });
        res.status(200).end();
    } else {

    }



});


export {deviceRoutes};
