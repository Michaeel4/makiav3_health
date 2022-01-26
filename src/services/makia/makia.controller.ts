import { getLicencePlateCollection } from '../db/mongodb.service';


export async function insertLicensePlate(makiaId: number, license_plate: string) {
    await getLicencePlateCollection().insertOne({
        id: makiaId,
        license_plate
    } as any);
}

export async function getLicensePlate(makiaId: number): Promise<string | undefined> {
    return (await getLicencePlateCollection().findOne<{ license_plate: string }>({
        id: makiaId
    }))?.license_plate;
}
