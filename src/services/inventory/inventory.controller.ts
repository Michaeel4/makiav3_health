import { InventoryEntryModel } from '../../models/inventory-entry.model';
import { getInventoryCollection } from '../mongodb.service';
import { v4 as uuid } from 'uuid';

export async function createInventoryEntry(entry: InventoryEntryModel): Promise<void> {
    await getInventoryCollection().insertOne({
        ...entry,
        _id: uuid()
    });
}

export async function updateInventoryEntry(entry: InventoryEntryModel): Promise<void> {
    await getInventoryCollection().replaceOne({_id: entry._id}, entry);
}

export async function getInventoryEntries(): Promise<InventoryEntryModel[]> {
    return await getInventoryCollection().find({}).toArray();
}

export async function deleteInventoryEntryById(id: string): Promise<void> {
    await getInventoryCollection().deleteOne({_id: id});

}
