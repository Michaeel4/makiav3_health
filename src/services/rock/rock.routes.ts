import { requireUser } from '../../middleware/auth.middleware';
import {
    createRockEntry,
    deleteRockEntry,
    getNeighborRockEntry,
    getRockEntries,
    getRockEntryById,
    labelRockEntry,
    unlabelRockEntry,
    updateRockEntryImages,
    updateRockEntryName
} from './rock.controller';
import { RockClassification, RockEntryModel } from '../../models/rock/rock-entry.model';

import { UploadedFile } from 'express-fileupload';
import { config } from '../../config';
import { getName } from '../../utils';
import path from 'path';
import fs from 'fs';
import express = require('express');

const rockRoutes = express.Router();

rockRoutes.get('/rock', requireUser, async (req, res) => {
    try {
        res.json(await getRockEntries());
    } catch {
        res.status(500).end();
    }

});

rockRoutes.get('/rock/:id', requireUser, async (req, res) => {
    try {
        res.json(await getRockEntryById(req.params.id));
    } catch {
        res.status(500).end();
    }

});

rockRoutes.post('/rock/:id/label', requireUser, async (req, res) => {
    const classification: RockClassification = req.body;
    const id = req.params.id;
    if (classification && id) {
        try {
            await labelRockEntry(id, classification);
            res.status(200).end();
        } catch {
            res.status(500).end();
        }
    } else {
        res.status(400).end();
    }
});

rockRoutes.delete('/rock/:id/label', requireUser, async (req, res) => {
    const id = req.params.id;
    if (id) {
        try {
            await unlabelRockEntry(id);
            res.status(200).end();
        } catch {
            res.status(500).end();
        }
    } else {
        res.status(400).end();
    }

});


rockRoutes.delete('/rock/:id', requireUser, async (req, res) => {
    const entry: RockEntryModel | null = await getRockEntryById(req.params.id);
    if (entry) {
        await deleteRockEntry(entry);
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

rockRoutes.post('/rock', requireUser, async (req, res) => {
    const rock: RockEntryModel = req.body;


    if (rock) {
        try {
            const id = await createRockEntry(rock);
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


rockRoutes.post('/rock/:id/images', requireUser, async (req, res) => {
    const entry: RockEntryModel | null = await getRockEntryById(req.params.id);
    const files = req.files;

    if (entry?._id && files) {
        let foundFiles: UploadedFile[] = [];
        for (let i = 0; i < 10; i++) {
            foundFiles[i] = files[i] as UploadedFile;
        }

        foundFiles = foundFiles.filter((f1) => !!f1);

        for (const f of foundFiles) {
            await f.mv(`${config.uploadDirs.rockImages}/${getName(f, entry.creationDate)}`);
        }


        const fileNames = foundFiles.map((file, index) => {
            return getName(file, entry.creationDate);
        });

        await updateRockEntryImages(entry, fileNames);


        res.status(200).end();
    } else {
        res.status(400).end();
    }


});

rockRoutes.post('/rock/:id/name', requireUser, async (req, res) => {
    const entry: RockEntryModel | null = await getRockEntryById(req.params.id);
    const name = req.body?.name;


    if (entry?._id && name) {
        await updateRockEntryName(entry, name);


        res.status(200).end();
    } else {
        res.status(400).end();
    }


});

rockRoutes.get('/rock/image/:hash', requireUser, (req, res) => {
    const mime = req.params.hash.split('_')[1].replace('.', '/');
    const filepath = path.resolve(`${config.uploadDirs.rockImages}/${req.params.hash}`);
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

rockRoutes.post('/rock/direction', requireUser, async (req, res) => {
    const currentId = req.body.currentId;
    const direction = req.body.direction;
    if (currentId && direction) {
        try {
            res.json({
                id: await getNeighborRockEntry(currentId, direction)
            });
        } catch {
            res.status(500).end();
        }
    } else {
        res.status(400).end();
    }


});


export { rockRoutes };


