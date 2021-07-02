import { v4 as uuid } from 'uuid';
import {  MeatEntryModel } from '../../models/meat/meat.model';
import { MeatFilterModel } from '../../models/meat/meat-filter.model';
import { getMeatCollection } from '../mongodb.service';
import { Condition, FilterQuery } from 'mongodb';
import { DeviceModel } from '../../models/device.model';
import { DiseaseModel } from '../../models/meat/disease.model';


export async function handleMeatEntry(entry: MeatEntryModel): Promise<string> {
    const existingEntries = await getMeatEntriesAtTimestamp(entry.timeStamp);
    if (existingEntries.length > 0) {
        const existing = existingEntries[0]; // take first found
        return existing._id!;
    } else {
        return await createMeatEntry(entry);
    }
}


async function createMeatEntry(entry: MeatEntryModel): Promise<string> {
    const _id = uuid();
    await getMeatCollection().insertOne({
        _id,
        ...entry,
        cameras: []
    });
    return _id;
}
async function updateMeatEntry(entry: MeatEntryModel): Promise<void> {
    await getMeatCollection().replaceOne({
        _id: entry._id
    }, entry);
}

export async function deleteMeatEntry(entry: MeatEntryModel): Promise<void> {
    await getMeatCollection().deleteOne({
        _id: entry._id
    });
}

export async function updateMeatEntryImages(entry: MeatEntryModel, device: DeviceModel, images: string[]): Promise<void> {
    entry.cameras?.push({
        deviceId: device._id!,
        images
    })

    await updateMeatEntry(entry);

}

export async function labelMeatEntry(_id: string, diseases: DiseaseModel[]): Promise<void> {
    await getMeatCollection().updateOne({
            _id
        },
        {
            $set: {
                diseasesManually: diseases
            }
        }
    );
}

export async function getMeatEntries(filter?: MeatFilterModel): Promise<MeatEntryModel[]> {
    return await getMeatCollection().find(filter ? buildFilter(filter) : {}).toArray();
}

export async function getMeatEntryById(id: string): Promise<MeatEntryModel | null> {
    return await getMeatCollection().findOne({_id: id});
}

const TIME_THRESHOLD = 1; // seconds
export async function getMeatEntriesAtTimestamp(timestamp: Date): Promise<MeatEntryModel[]> {
    const start = new Date(timestamp.getTime() - (1000 * TIME_THRESHOLD));
    const end = new Date(timestamp.getTime() + (1000 * TIME_THRESHOLD));



    const filter: MeatFilterModel = {
        dateRange: {
            start,
            end
        }
    }

    return await getMeatEntries(filter);
}


export async function getNeighborEntry(currentId: string, direction: 'NEXT' | 'PREVIOUS', labelled: boolean): Promise<string | null> {

    const currentEntry = await getMeatEntryById(currentId);

    if (currentEntry) {
        if (direction === 'NEXT' ) {
            return (await getMeatCollection().find({
                timeStamp: {
                    $gt: currentEntry?.timeStamp
                },

                diseasesManually: {
                    $exists: labelled
                }

            }).sort({
                timeStamp: 1
            }).limit(1)
                .toArray())[0]?._id
        }

        return (await getMeatCollection().find({
            timeStamp: {
                $lt:  currentEntry?.timeStamp
            },
            diseasesManually: {
                $exists: labelled
            }
        }).sort({
            timeStamp: -1
        }).limit(1)
            .toArray())[0]?._id
    }
    return null;
}

export function buildFilter(filterModel: MeatFilterModel): FilterQuery<MeatEntryModel> {
    let query: FilterQuery<MeatEntryModel> = {};

    if (filterModel.locationId) {
        query = buildPointFilter(query, 'locationId', filterModel.locationId);
    }
    if (filterModel.dateRange?.start || filterModel.dateRange?.end) {
        query = buildRangeFilter(query, 'timeStamp', filterModel.dateRange.start, filterModel.dateRange.end);
    }
    if (filterModel.types) {
        query = buildMultipleFilter(query, 'type', filterModel.types);
    }
    if (filterModel.labelled !== undefined) {
        query = buildExistFilter(query, 'diseasesManually', filterModel.labelled);
    }

    return query;
}

function buildPointFilter(filterQuery: FilterQuery<MeatEntryModel>, key: keyof MeatEntryModel, value: any): FilterQuery<MeatEntryModel> {
    return {
        ...filterQuery,
        [key]: value
    };
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
    };
}

function buildMultipleFilter(filterQuery: FilterQuery<MeatEntryModel>, key: keyof MeatEntryModel, value: any[]): FilterQuery<MeatEntryModel> {
    return {
        ...filterQuery,
        [key]: {
            $in: value
        }
    };
}

function buildExistFilter(filterQuery: FilterQuery<MeatEntryModel>, key: keyof MeatEntryModel, value: boolean): FilterQuery<MeatEntryModel> {
    return {
        ...filterQuery,
        [key]: {
            $exists: value
        }
    };
}
