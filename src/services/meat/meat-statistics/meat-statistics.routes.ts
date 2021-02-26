import express = require('express');
import { requireUser } from '../../../middleware/auth.middleware';
import { getMeatEntries } from '../meat.controller';
import { calculateStatistic } from './meat-statistics.controller';

const meatStatisticsRoutes = express.Router();

meatStatisticsRoutes.get('/meat/statistics/:locationId', requireUser, async (req, res) => {
    const locationId = req.params.locationId;
    try {
        res.json(await calculateStatistic(locationId));
    } catch {
        res.status(500).end();
    }

});

export {meatStatisticsRoutes};
