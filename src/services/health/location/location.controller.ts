import { UserModel } from '../../../models/health/user.model';
import { LocationModel } from '../../../models/health/location.model';
import { getLocationCollection } from '../../db/mongodb.service';
import { v4 as uuid } from 'uuid';
import { isAllowedForProject } from '../project/project.controller';

export function isAllowedForLocation(user: UserModel, locationId: string) {
    return user.admin || user.permissions.allowedLocations.findIndex(allowed => {
        return locationId === allowed;
    }) > -1;
}

async function getLocations(): Promise<LocationModel[]> {
    return await getLocationCollection().find<LocationModel>({}).toArray();
}

export async function getAllowedLocations(user: UserModel): Promise<LocationModel[]> {
    const locations: LocationModel[] = await getLocations();
    const allowedLocations = locations.filter(
        location => location._id && isAllowedForLocation(user, location._id)
            && isAllowedForProject(user, location.projectId)
    );
    return allowedLocations;
}

export async function createLocation(location: LocationModel): Promise<void> {
    await getLocationCollection().insertOne({
        ...location,
        _id: uuid()
    } as any);
}

export async function updateLocation(location: LocationModel): Promise<void> {
    await getLocationCollection().replaceOne({
        _id: location._id
    }, location);
}
