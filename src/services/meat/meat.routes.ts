import express = require('express');
import {
    deleteMeatEntry,
    getMeatEntries,
    getMeatEntryById,
    getNeighborEntry,
    handleMeatEntry,
    labelMeatEntry, updateMeatEntryImages,
} from './meat.controller';
import { requireDeviceToken, requireUser } from '../../middleware/auth.middleware';
import { UploadedFile } from 'express-fileupload';
import { config } from '../../config';
import path from 'path';
import fs from 'fs';
import {  MeatEntryModel } from '../../models/meat/meat.model';
import { getName } from '../../utils';
import { MeatFilterModel } from '../../models/meat/meat-filter.model';
import { DiseaseModel } from '../../models/meat/disease.model';

const meatRoutes = express.Router();

meatRoutes.get('/meat', requireUser, async (req, res) => {
    try {
        res.json(await getMeatEntries());
    } catch {
        res.status(500).end();
    }

});

meatRoutes.get('/meat/:id', requireUser, async (req, res) => {
    try {
        res.json(await getMeatEntryById(req.params.id));
    } catch {
        res.status(500).end();
    }

});

meatRoutes.post('/meat/:id/label', requireUser, async (req, res) => {
    const diseases: DiseaseModel[] = req.body;
    const id = req.params.id;
    if (diseases && id) {
        try {
            await labelMeatEntry(id, diseases);
            res.status(200).end();
        } catch {
            res.status(500).end();
        }
    } else {
        res.status(400).end();
    }
});

meatRoutes.delete('/meat/:id', requireUser, async (req, res) => {
    const entry: MeatEntryModel | null = await getMeatEntryById(req.params.id);
    if (entry) {
        await deleteMeatEntry(entry);
    } else {
        res.status(400).end();
    }
});

meatRoutes.post('/meat', requireDeviceToken, async (req, res) => {
    const meat: MeatEntryModel = req.body;
    // @ts-ignore
    const device = req.device;

    if (meat && device) {
        try {
            const id = await handleMeatEntry(meat);
            if (id) {
                res.json({
                    id
                });
            }
        } catch (e) {
            console.dir(e);
            res.status(500).end();
        }
    } else {
        res.status(400).end();
    }
});


meatRoutes.post('/meat/:id/images', requireDeviceToken, async (req, res) => {

    // @ts-ignore
    const device = req.device;
    const entry: MeatEntryModel | null = await getMeatEntryById(req.params.id);
    const files = req.files;

    if (device && entry?._id && files) {
        let foundFiles: UploadedFile[] = [];
        for (let i = 0; i < 10; i++) {
            foundFiles[i] = files[i] as UploadedFile;
        }

        foundFiles = foundFiles.filter((f1) => !!f1);

        for (const f of foundFiles) {
            await f.mv(`${config.uploadDirs.meat}/${getName(f, entry.timeEnter)}`);
        }


        const fileNames = foundFiles.map((file, index) => {
            return getName(file, entry.timeEnter);
        });

        await updateMeatEntryImages(entry, device, fileNames);


        res.status(200).end();
    } else {
        res.status(400).end();
    }


});

meatRoutes.get('/meat/image/:hash', requireUser, (req, res) => {
    const mime = req.params.hash.split('_')[1].replace('.', '/');
    const filepath = path.resolve(`${config.uploadDirs.meat}/${req.params.hash}`);
    if (mime.startsWith('video')) {
        const size = fs.statSync(filepath).size;
        const head = {
            'Content-Length': size,
            'Content-Type': mime,
        };
        res.writeHead(200, head);
        fs.createReadStream(filepath).pipe(res);

    } else {
        res.contentType(mime);

        res.sendFile(filepath);

    }

});

meatRoutes.post('/meat/direction', requireUser, async (req, res) => {
    const currentId = req.body.currentId;
    const direction = req.body.direction;
    if (currentId && direction) {
        try {
            res.json({
                id: await getNeighborEntry(currentId, direction)
            });
        } catch {
            res.status(500).end();
        }
    } else {
        res.status(400).end();
    }


});


meatRoutes.post('/meat/filter', requireUser, async (req, res) => {
    const filter: MeatFilterModel = req.body;

    try {
        res.json(await getMeatEntries(filter));
    } catch {
        res.status(500).end();
    }
});


export { meatRoutes };
