import express = require('express');
import { requireAdmin } from '../middleware/auth.middleware';
import { getInventoryCollection } from './mongodb.service';
import { v4 as uuid } from 'uuid';
import { InventoryEntryModel } from '../models/inventory-entry.model';

const inventoryRoutes = express.Router();

inventoryRoutes.post('/inventory', requireAdmin, async (req, res) => {
    const entry: InventoryEntryModel = req.body;
    await getInventoryCollection().insertOne({
        ...entry,
        _id: uuid()
    });
    res.status(200).end();
});

inventoryRoutes.post('/inventory/:id', requireAdmin, async (req, res) => {
    const entry: InventoryEntryModel = req.body;
    try {
        await getInventoryCollection().replaceOne({_id: req.params.id}, entry);
        res.status(200).end();
    } catch {
        res.sendStatus(400);
    }
});

inventoryRoutes.get('/inventory', requireAdmin, async (req, res) => {
    const entries: InventoryEntryModel[] = await getInventoryCollection().find({}).toArray();
    res.json(entries);
});

inventoryRoutes.delete('/inventory/:id', requireAdmin, async (req, res) => {
    try {
        await getInventoryCollection().deleteOne({_id: req.params.id});
        res.status(200).end();
    } catch {
        res.sendStatus(400);
    }
});


export { inventoryRoutes };
