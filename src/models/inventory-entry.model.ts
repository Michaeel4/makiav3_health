export interface InventoryEntryModel {
    _id?: string;
    name: string;
    description: string;
    amount: number;
    locationId?: string;
}
