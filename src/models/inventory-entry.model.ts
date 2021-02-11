
export interface InventoryEntryModel {
    _id?: string;
    name: string;
    amount: number;
    locationId?: string;
    projectId?: string;
}
