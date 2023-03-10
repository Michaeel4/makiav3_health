import { InventoryEntryModel } from '../../../models/health/inventory-entry.model';
import { getInventoryCollection } from '../../db/mongodb.service';
import { v4 as uuid } from 'uuid';

export async function createInventoryEntry(entry: InventoryEntryModel): Promise<void> {
    await getInventoryCollection().insertOne({
        ...entry,
        _id: uuid()
    } as any);
}

export async function updateInventoryEntry(entry: InventoryEntryModel): Promise<void> {
    await getInventoryCollection().replaceOne({_id: entry._id}, entry);
}

export async function getInventoryEntries(): Promise<InventoryEntryModel[]> {
    return await getInventoryCollection().find<InventoryEntryModel>({}).toArray();
}

export async function deleteInventoryEntryById(id: string): Promise<void> {
    await getInventoryCollection().deleteOne({_id: id});

}
