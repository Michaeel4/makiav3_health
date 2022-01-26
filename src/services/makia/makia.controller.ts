import { getLicencePlateCollection } from '../db/mongodb.service';


export async function insertLicensePlate(makiaId: string, license_plate: string) {
    await getLicencePlateCollection().insertOne({
        _id: makiaId,
        license_plate
    } as any);
}

export async function getLicensePlate(makiaId: string): Promise<string | undefined> {
    return (await getLicencePlateCollection().findOne<{ license_plate: string }>({
        _id: makiaId
    }))?.license_plate;
}
