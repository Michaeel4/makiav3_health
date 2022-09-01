import { v4 as uuid } from 'uuid';
import { MeatClassification, MeatEntryModel } from '../../models/meat/meat.model';
import { MeatFilterModel } from '../../models/meat/meat-filter.model';
import { getMeatCollection } from '../db/mongodb.service';
import { DeviceModel } from '../../models/health/device.model';
import { buildFilter } from './filter.controller';
import path from 'path';
import { config } from '../../config';
import fs from 'fs';

const Moment = require('moment');
const MomentRange = require('moment-range');


const moment = MomentRange.extendMoment(Moment);

export async function handleMeatEntry(entry: MeatEntryModel): Promise<string> {
    return await createMeatEntry(entry);
}


async function createMeatEntry(entry: MeatEntryModel): Promise<string> {
    const _id = uuid();
    await getMeatCollection().insertOne({
        _id,
        ...entry,
        cameras: []
    } as any);
    return _id;
}

async function updateMeatEntry(entry: MeatEntryModel): Promise<void> {
    await getMeatCollection().replaceOne({
        _id: entry._id
    }, entry);
}

export async function deleteMeatEntry(entry: MeatEntryModel): Promise<void> {
    for (const camera of entry.cameras ?? []) {
        for (const image of camera.images ?? []) {
            const filepath = path.resolve(`${config.uploadDirs.meatImages}/${image}`);
            try {
                await fs.promises.unlink(filepath);
            } catch (e) {
                console.error('delete error', e);
            }
        }
    }


    await getMeatCollection().deleteOne({
        _id: entry._id
    });
}

export async function deleteAllMeatEntries(): Promise<void> {
    const entries = await getMeatEntries();
    await Promise.all(entries.map(async entry => {
        await deleteMeatEntry(entry);
    }));
}

export async function updateMeatEntryImages(entry: MeatEntryModel, device: DeviceModel, images: string[]): Promise<void> {
    entry.cameras?.push({
        deviceId: device._id!,
        images
    });

    await updateMeatEntry(entry);

}

export async function labelMeatEntry(_id: string, classification: MeatClassification): Promise<void> {
    await getMeatCollection().updateOne({
            _id
        },
        {
            $set: {
                classificationManually: classification
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
                classificationManually: ''
            }
        }
    );
}

export async function getMeatEntries(filter?: MeatFilterModel): Promise<MeatEntryModel[]> {
    return (await getMeatCollection().find<MeatEntryModel>(filter ? buildFilter(filter) as any : {}).toArray()) as unknown as MeatEntryModel[];
}

export async function getMeatEntryById(id: string): Promise<MeatEntryModel | null> {
    return await getMeatCollection().findOne<MeatEntryModel>({_id: id});
}


export async function getNeighborMeatEntry(currentId: string, direction: 'NEXT' | 'PREVIOUS'): Promise<string | undefined> {

    const currentEntry = await getMeatEntryById(currentId);

    if (currentEntry) {
        if (direction === 'NEXT') {
            return (await getMeatCollection().find<MeatEntryModel>({
                timeEnter: {
                    $gt: currentEntry?.timeEnter
                }

            }).sort({
                timeEnter: 1
            }).limit(1)
                .toArray())[0]?._id;
        }

        return (await getMeatCollection().find<MeatEntryModel>({
            timeEnter: {
                $lt: currentEntry?.timeEnter
            }
        }).sort({
            timeEnter: -1
        }).limit(1)
            .toArray())[0]?._id;
    }
    return undefined;
}

