import express = require('express');
import {
    deleteAllMeatEntries,
    deleteMeatEntry,
    getMeatEntries,
    getMeatEntryById,
    getNeighborMeatEntry,
    handleMeatEntry,
    labelMeatEntry,
    unlabelMeatEntry,
    updateMeatEntryImages,
} from './meat.controller';
import { requireAdmin, requireDeviceToken, requireUser } from '../../middleware/auth.middleware';
import { UploadedFile } from 'express-fileupload';
import { config } from '../../config';
import path from 'path';
import fs from 'fs';
import { MeatClassification, MeatEntryModel } from '../../models/meat/meat.model';
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

meatRoutes.delete('/meat', requireAdmin, async (req, res) => {
    try {
        await deleteAllMeatEntries();
    } catch {
        res.status(500).end();
    }
});

meatRoutes.post('/meat/:id/label', requireUser, async (req, res) => {
    const classification: MeatClassification = req.body.classification;
    const id = req.params.id;
    if (classification >= 0 && id) {
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

meatRoutes.delete('/meat/:id/label', requireUser, async (req, res) => {
    const id = req.params.id;
    if (id) {
        try {
            await unlabelMeatEntry(id);
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
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

meatRoutes.post('/meat', requireDeviceToken, async (req, res) => {
    const meat: MeatEntryModel = req.body;
    if (meat) {
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
        let i = 0;
        while (files[i]) {
            foundFiles[i] = files[i] as UploadedFile;
            i++;
        }

        foundFiles = foundFiles.filter((f1) => !!f1);

        for (const f of foundFiles) {
            await f.mv(`${config.uploadDirs.meatImages}/${getName(f, entry.timeEnter)}`);
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
    const filepath = path.resolve(`${config.uploadDirs.meatImages}/${req.params.hash}`);
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
                id: await getNeighborMeatEntry(currentId, direction)
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
