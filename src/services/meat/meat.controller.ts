import { v4 as uuid } from 'uuid';
import { MeatEntryModel } from '../../models/meat/meat.model';
import { MeatFilterModel } from '../../models/meat/meat-filter.model';
import { getMeatCollection } from '../mongodb.service';
import { Condition, FilterQuery } from 'mongodb';

export async function createMeatEntry(entry: MeatEntryModel): Promise<string>{
    const _id = uuid();
     await getMeatCollection().insertOne({
        _id,
        ...entry
    });
    return _id;
}

export async function getMeatEntries(filter?: MeatFilterModel): Promise<MeatEntryModel[]> {
    return await getMeatCollection().find(filter ? buildFilter(filter) : {}).toArray();
}
export async function getMeatEntryById(id: string): Promise<MeatEntryModel | null> {
    return await getMeatCollection().findOne({_id: id});
}

export async function updateMeatEntryImages(id: string, images: (string | null)[]): Promise<void> {
    await getMeatCollection().updateOne({_id: id}, {$set: { images }})
}
export function buildFilter(filterModel: MeatFilterModel): FilterQuery<MeatEntryModel> {
    let query: FilterQuery<MeatEntryModel> = {};

    if (filterModel.locationId) {
        query = buildPointFilter(query, "locationId", filterModel.locationId);
    }
    if (filterModel.dateRange?.start || filterModel.dateRange?.end) {
        query = buildRangeFilter(query, "timeStamp", filterModel.dateRange.start, filterModel.dateRange.end);
    }
    if (filterModel.types) {
        query = buildMultipleFilter(query, "type", filterModel.types);
    }

    return query;
}

function buildPointFilter(filterQuery: FilterQuery<MeatEntryModel>, key: keyof MeatEntryModel, value: any): FilterQuery<MeatEntryModel> {
    return {
        ...filterQuery,
        [key]: value
    }
}

function buildRangeFilter(filterQuery: FilterQuery<MeatEntryModel>, key: keyof MeatEntryModel, startValue: any, endValue: any): FilterQuery<MeatEntryModel> {
    const search: Condition<MeatEntryModel> = {};
    if (startValue) {
        search.$gte = startValue;
    }
    if (endValue) {
        search.$lte = endValue;
    }

    return {
        ...filterQuery,
        [key]: search
    }
}

function buildMultipleFilter(filterQuery: FilterQuery<MeatEntryModel>, key: keyof MeatEntryModel, value: any[]): FilterQuery<MeatEntryModel> {
    return {
        ...filterQuery,
        [key]: {
            $in: value
        }
    }
}
