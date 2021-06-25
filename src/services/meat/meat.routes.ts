import express = require('express');
import {
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
import { Classification, MeatEntryModel } from '../../models/meat/meat.model';
import { getName } from '../../utils';
import { MeatFilterModel } from '../../models/meat/meat-filter.model';

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
    const classification: Classification = req.body;
    const id = req.params.id;
    if (classification && id) {
        try {
            await labelMeatEntry(id, classification);
            res.status(200).end();
        } catch {
            res.status(500).end();
        }
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
        } catch {
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
        const foundFiles: UploadedFile[] = [];
        for (let i = 0; i < 10; i++) {
            foundFiles[i] = files[i] as UploadedFile;
        }

        for (const f of foundFiles.filter((f1) => f1)) {
            await f.mv(`${config.uploadDirs.meat}/${getName(f, entry.timeStamp)}`);
        }


        const fileNames = foundFiles.map((file, index) => {
            return getName(file, entry.timeStamp);
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
    const labelled = req.body.labelled;
    if (currentId && direction) {
        try {
            res.json({
                id: await getNeighborEntry(currentId, direction, labelled)
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
