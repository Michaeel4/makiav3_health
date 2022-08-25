import { PingModel } from '../../../models/health/ping.model';
import { DeviceModel } from '../../../models/health/device.model';
import { config } from '../../../config';
import express from 'express';
import { imagesForDevice, setVideoUploading, updateDevicePing } from './client.controller';
import { getDeviceById } from '../device/device.controller';
import * as fs from 'fs';
import * as path from 'path';
import { imageMutex } from '../../../server';

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
    await imageMutex.runExclusive(() => {
        if (image && !Array.isArray(image) && device?._id) {
            imagesForDevice[device._id] = image.data;
            res.status(200).end();
        } else {
            res.status(400).end();
        }
    });

});

clientRoutes.post('/device/:id/video', async (req, res) => {
    const video = req.files?.video;
    const device: DeviceModel | null = await getDeviceById(req.params.id);
    const folder = req.header('Path');

    if (video && !Array.isArray(video) && device?._id && folder) {
        try {
            await setVideoUploading(device, true);

            const fileName = video.name;
            const camFolder = device._id;
            const absFolder = path.join(config.uploadDirs.meatVideos, camFolder, folder);
            if (!fs.existsSync(absFolder)) {
                await fs.promises.mkdir(absFolder, {recursive: true});
            }

            console.log('Write file ...', fileName);

            await video.mv(path.join(absFolder, fileName));


            console.log('Written file ...', fileName);
            res.status(200).end();
        } catch (e) {
            console.error(e);
            res.status(500).end();
        } finally {
            await setVideoUploading(device, false);
        }
    } else {
        res.status(400).end();
    }
});

export { clientRoutes };
