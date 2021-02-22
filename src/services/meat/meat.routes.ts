import express = require('express');
import { getMeatEntries, getMeatEntryById, createMeatEntry, updateMeatEntryImages } from './meat.controller';
import { requireDeviceToken, requireUser } from '../../middleware/auth.middleware';
import { UploadedFile } from 'express-fileupload';
import { config } from '../../config';
import path from 'path';
import fs from 'fs';
import { MeatEntryModel } from '../../models/meat/meat.model';
import { getName } from '../../utils';
import { MeatFilterModel } from '../../models/meat/meat-filter.model';

const meatRoutes = express.Router();

meatRoutes.get('/meat', requireUser, async (req, res) => {
    try {
        res.json(await getMeatEntries())
    } catch {
        res.status(500).end();
    }

});

meatRoutes.post('/meat', requireDeviceToken, async (req, res) => {
    const meat: MeatEntryModel = req.body;

    if (meat) {
        try {
            const id = await createMeatEntry(meat);
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

        const entry: MeatEntryModel | null = await getMeatEntryById(req.params.id);
        const files = req.files;

        if (entry?._id && files) {
            const foundFiles: UploadedFile[] = [files.first ?? null, files.second ?? null] as UploadedFile[];
            for (const f of foundFiles.filter((f1) => f1 !== null)) {
                await f.mv(`${config.uploadDirs.meat}/${getName(f)}`);
            }

            await updateMeatEntryImages(entry._id, foundFiles.map(f => {
                return f ? getName(f) : null
            }));


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


 meatRoutes.post('/meat/filter', requireUser, async (req, res) => {
     const filter: MeatFilterModel = req.body;

    try {
        res.json(await getMeatEntries(filter))
    } catch {
        res.status(500).end();
    }
 });


export {meatRoutes};
