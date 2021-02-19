import { requireAdmin } from '../../middleware/auth.middleware';
import { InventoryEntryModel } from '../../models/inventory-entry.model';
import {
    createInventoryEntry,
    deleteInventoryEntryById,
    getInventoryEntries,
    updateInventoryEntry
} from './inventory.controller';
import express from 'express';

const inventoryRoutes = express.Router();

inventoryRoutes.post('/inventory', requireAdmin, async (req, res) => {
    const entry: InventoryEntryModel = req.body;
    await createInventoryEntry(entry);
    res.status(200).end();
});

inventoryRoutes.post('/inventory/:id', requireAdmin, async (req, res) => {
    const entry: InventoryEntryModel = req.body;
    try {
        await updateInventoryEntry(entry);
        res.status(200).end();
    } catch {
        res.sendStatus(400);
    }
});

inventoryRoutes.get('/inventory', requireAdmin, async (req, res) => {
    res.json(await getInventoryEntries());
});

inventoryRoutes.delete('/inventory/:id', requireAdmin, async (req, res) => {
    try {
        await deleteInventoryEntryById(req.params.id);
        res.status(200).end();
    } catch {
        res.sendStatus(400);
    }
});


export { inventoryRoutes };
