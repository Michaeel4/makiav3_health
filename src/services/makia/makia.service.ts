import express = require('express');
import moment = require('moment');
import { MakiaLocation } from '../../models/makia/location';
import { getPool } from '../db/mysql.service';
import { MakiaEntry } from '../../models/makia/entry';
import { MakiaFilter } from '../../models/makia/filter';
import { Moment } from 'moment';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { requireDeviceToken, requireUser } from '../../middleware/auth.middleware';
import { getLicensePlate, getLicensePlates, insertLicensePlate } from './makia.controller';

const makiaRoutes = express.Router();


// Get Locations
makiaRoutes.get('/makia/locations', requireUser, async (req, res) => {
    const rows: MakiaLocation[] = await (getPool().query(
        'SELECT * FROM locations;'
    ));
    res.json(rows);

});


// Get Entries
makiaRoutes.get('/makia/entries', requireUser, async (req, res) => {
    const rows: MakiaEntry[] = await (getPool().query(
        'SELECT * FROM entries LIMIT 10000;'
    ));
    res.json(rows);
});


// Add Entry
makiaRoutes.post('/makia/entries', requireDeviceToken, async (req, res) => {
    const entry = req.body as MakiaEntry;

    console.log('new entry added', new Date());
    console.dir(entry);
    getPool().query(
        'INSERT INTO entries (timestamp, locationID, direction, ' +
        'category, stoppedForMs, avgVelocity, minVelocity, stoppedDistance, convoyIndex, convoyType)' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [entry.timestamp, entry.locationID, entry.direction, entry.category, entry.stoppedForMs,
            entry.avgVelocity, entry.minVelocity, entry.stoppedDistance, entry.convoyIndex, entry.convoyType])
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.json(error);
        });

});

// Add LicensePlate
makiaRoutes.post('/makia/entries/:id/license_plate', requireUser, async (req, res) => {
    const entry = req.body as { license_plate: string };
    const plate = entry.license_plate;
    const entryId = req.params.id;
    if (plate?.length && entryId?.length) {
        try {
            await insertLicensePlate(Number.parseInt(entryId), plate);
            res.status(200).end();
        } catch (e) {
            console.error(e);
            res.status(500).end();
        }

    } else {
        res.status(400).end();
    }
});
// Get LicensePlate
makiaRoutes.get('/makia/entries/:id/license_plate', requireUser, async (req, res) => {
    const entryId = req.params.id;
    if (entryId) {
        try {

            const license_plate = await getLicensePlate(Number.parseInt(entryId));
            res.json({
                license_plate
            });
        } catch (e) {
            console.error(e);
            res.status(500).end();
        }
    } else {
        res.status(400).end();
    }

});


// Get Status
makiaRoutes.post('/makia/status', requireUser, async (req, res) => {
    const filter: MakiaFilter = req.body;
    const query = `SELECT COUNT(*) AS Count FROM online_time WHERE timestamp >= "${filter.min_value}" AND timestamp <= "${filter.max_value}";`;
    console.log(query);
    const result = (await (getPool().query(query)))[0].Count;

    const startTime: Moment = moment(filter.min_value);
    const endTime: Moment = moment(filter.max_value);

    const minutesAll = endTime.diff(startTime, 'minutes');

    const percentage = result / minutesAll;
    res.json(percentage);
});

// Get filtered entries
makiaRoutes.post('/makia/entries/filter', requireUser, async (req, res) => {
    const filters: MakiaFilter[] = req.body;
    const conditions: string[] = filters.map((filter) => {
        // Array Conditions
        if (filter.min_value instanceof Array) {
            const values = filter.min_value as string[];
            if (values.length === 0) {
                return 'FALSE';
            }
            let condition: string = '(';
            for (let i = 0; i < values.length; i++) {
                // Weekdays
                if (filter.key === 'weekday') {
                    condition += `WEEKDAY(timestamp) = "${values[i]}"`;
                } else {
                    // Categories
                    condition += `${filter.key} = "${values[i]}"`;
                }

                if (i < values.length - 1) {
                    condition += ' OR ';
                }
            }
            condition += ')';
            return condition;
        } else if (filter.key === 'time') {
            const conjunction = filter.min_value <= filter.max_value ? 'AND' : 'OR';
            return `(TIME(timestamp) >= "${filter.min_value}" ${conjunction} TIME(timestamp) <= "${filter.max_value}")`;
        }
        // Min/Max Conditions
        return `${filter.key} >= "${filter.min_value}" AND ${filter.key} <= "${filter.max_value}"`;
    });

    let query = 'SELECT * FROM entries WHERE ';

    for (let i = 0; i < conditions.length; i++) {
        query += conditions[i];
        if (i < conditions.length - 1) {
            query += ' AND ';
        }
    }

    const rows: MakiaEntry[] = await (getPool().query(query));

    const licensePlates = await getLicensePlates(rows.map(row => row.id));

    rows.forEach(row => {
        row.license_plate = licensePlates?.find(plate => plate.id === row.id)?.license_plate;
    });


    res.json(rows);

});


makiaRoutes.get('/makia/dump_plates', async (req, res) => {
    const rows: MakiaEntry[] = await (getPool().query(
        'SELECT * FROM entries WHERE id > 766817;'
    ));

    const images: string[] = [];
    rows.forEach(row => {
        if (row.images) {
            const imgs = JSON.parse(row.images);
            const plateImg = imgs[3];
            if (plateImg) {
                images.push(plateImg);
            }


        }
    });
    console.log(`dumping ${images.length} images...`);

    for (let i = 0; i < images.length; i++) {
        await fs.promises.copyFile(`/mnt/images/makia/${images[i]}`, `/mnt/images/number_plates/${i}.jpg`);

    }
    console.log(`dumped ${images.length} images.`);

    res.json({count: images.length});

});

function getname(f: any) {
    return f.md5 + '_' + f.mimetype.replace('/', '.');
}


makiaRoutes.post('/makia/entries/:id/images', requireDeviceToken, async (req, res) => {
    console.log('new media uploaded for entry: ', req.params.id, 'video:', !!((req.files as any).video), new Date());


    const rows: MakiaEntry[] = await (getPool().query(
        `SELECT * FROM entries WHERE id = ?;`,
        [req.params.id]
    ));
    const entry = rows[0];
    const files = req.files as any;

    const foundFiles: UploadedFile[] = [files.video ?? null, files.license_plate ?? null, files.face ?? null, files.secondary ?? null];

    for (const f of foundFiles.filter((f1) => f1 !== null)) {
        await f.mv('/mnt/images/makia/' + getname(f));

    }


    await (getPool().query('UPDATE entries SET images = ? WHERE id = ?;',
        [JSON.stringify(foundFiles.map((f3, i) => {
            return f3 ? getname(f3) : entry.images ? JSON.parse(entry.images)?.[i] ?? null : null;
        })), req.params.id
        ]));

    res.json(entry);
});

makiaRoutes.get('/makia/image/:hash', (req, res) => {
    const mime = req.params.hash.split('_')[1].replace('.', '/');
    const filepath = path.resolve('/mnt/images/makia/' + req.params.hash);
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


export { makiaRoutes };
