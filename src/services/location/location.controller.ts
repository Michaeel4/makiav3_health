import { UserModel } from '../../models/user.model';
import { LocationModel } from '../../models/location.model';
import { getLocationCollection } from '../mongodb.service';
import { v4 as uuid } from 'uuid';
import { isAllowedForProject } from '../project/project.controller';

export function isAllowedForLocation(user: UserModel, locationId: string) {
    return user.admin || user.permissions.allowedLocations.findIndex(allowed => {
        return locationId === allowed;
    }) > -1;
}

async function getLocations(): Promise<LocationModel[]> {
    return await getLocationCollection().find({}).toArray();
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
    });
}

export async function updateLocation(location: LocationModel): Promise<void> {
    await getLocationCollection().replaceOne({
        _id: location._id
    }, location);
}
