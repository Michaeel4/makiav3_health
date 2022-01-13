import { v4 as uuid } from 'uuid';
import { getRockCollection } from '../db/mongodb.service';
import { RockClassification, RockEntryModel } from '../../models/rock/rock-entry.model';


export async function createRockEntry(entry: RockEntryModel): Promise<string> {
    const _id = uuid();
    await getRockCollection().insertOne({
        _id,
        ...entry,
        images: []
    } as any);
    return _id;
}

async function updateRockEntry(entry: RockEntryModel): Promise<void> {
    await getRockCollection().replaceOne({
        _id: entry._id
    }, entry);
}

export async function deleteRockEntry(entry: RockEntryModel): Promise<void> {
    await getRockCollection().deleteOne({
        _id: entry._id
    });
}

export async function updateRockEntryImages(entry: RockEntryModel, images: string[]): Promise<void> {
    entry.images = images;
    await updateRockEntry(entry);
}

export async function updateRockEntryName(entry: RockEntryModel, name: string): Promise<void> {
    entry.name = name;
    await updateRockEntry(entry);
}

export async function labelRockEntry(_id: string, classification: RockClassification): Promise<void> {
    await getRockCollection().updateOne({
            _id
        },
        {
            $set: {
                classificationManually: classification
            }
        }
    );
}

export async function unlabelRockEntry(_id: string): Promise<void> {
    await getRockCollection().updateOne({
            _id
        },
        {
            $unset: {
                classificationManually: ''
            }
        }
    );
}


export async function getRockEntries(): Promise<RockEntryModel[]> {
    return await getRockCollection().find<RockEntryModel>({}).toArray();
}

export async function getRockEntryById(id: string): Promise<RockEntryModel | null> {
    return await getRockCollection().findOne<RockEntryModel>({_id: id});
}


export async function getNeighborRockEntry(currentId: string, direction: 'NEXT' | 'PREVIOUS'): Promise<string | undefined> {

    const currentEntry = await getRockEntryById(currentId);

    if (currentEntry) {
        if (direction === 'NEXT') {
            return (await getRockCollection().find<RockEntryModel>({
                creationDate: {
                    $gt: currentEntry?.creationDate
                }

            }).sort({
                creationDate: 1
            }).limit(1)
                .toArray())[0]?._id;
        }

        return (await getRockCollection().find<RockEntryModel>({
            creationDate: {
                $lt: currentEntry?.creationDate
            }
        }).sort({
            creationDate: -1
        }).limit(1)
            .toArray())[0]?._id;
    }
    return undefined;
}
