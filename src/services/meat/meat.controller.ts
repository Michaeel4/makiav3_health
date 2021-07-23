import { v4 as uuid } from 'uuid';
import {  MeatEntryModel } from '../../models/meat/meat.model';
import { MeatFilterModel } from '../../models/meat/meat-filter.model';
import { getMeatCollection } from '../mongodb.service';
import { Condition, FilterQuery } from 'mongodb';
import { DeviceModel } from '../../models/device.model';
import { DiseaseModel } from '../../models/meat/disease.model';
import { buildFilter } from './filter.controller';
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
export async function handleMeatEntry(entry: MeatEntryModel): Promise<string> {
    const existingEntries = await getMeatEntriesAtTimestamp(entry.timeEnter, entry.timeLeave);
    if (existingEntries.length > 0) {
        const existing = existingEntries[0]; // take first found
        if(entry.slaughterId) {
            existing.slaughterId = entry.slaughterId;
            await updateMeatEntry(existing);
        }
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

export async function unlabelMeatEntry(_id: string): Promise<void> {
    await getMeatCollection().updateOne({
            _id
        },
        {
            $unset: {
                diseasesManually: ''
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

export async function getMeatEntriesAtTimestamp(timeEnter: Date, timeLeave: Date): Promise<MeatEntryModel[]> {
    const entries = await getMeatEntries();
    const range = moment.range(moment(timeEnter), moment(timeLeave));

    const matched = entries.filter(existing => {
        const existingRange = moment.range(moment(existing.timeEnter), moment(existing.timeLeave));
        return existingRange.overlaps(range);
    });

    console.dir(matched);

    return matched;
}


export async function getNeighborEntry(currentId: string, direction: 'NEXT' | 'PREVIOUS'): Promise<string | null> {

    const currentEntry = await getMeatEntryById(currentId);

    if (currentEntry) {
        if (direction === 'NEXT' ) {
            return (await getMeatCollection().find({
                timeEnter: {
                    $gt: currentEntry?.timeEnter
                }

            }).sort({
                timeEnter: 1
            }).limit(1)
                .toArray())[0]?._id
        }

        return (await getMeatCollection().find({
            timeEnter: {
                $lt:  currentEntry?.timeEnter
            }
        }).sort({
            timeEnter: -1
        }).limit(1)
            .toArray())[0]?._id
    }
    return null;
}

