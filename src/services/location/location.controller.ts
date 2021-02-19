import { UserModel } from '../../models/user.model';
import { LocationModel } from '../../models/location.model';
import { getLocationCollection } from '../mongodb.service';
import { v4 as uuid} from 'uuid';

export  function isAllowedForLocation(user: UserModel, location: LocationModel) {
    return user.admin || user.allowedLocations.findIndex(allowed => {
        return location._id === allowed
    }) > -1;
}

async function getLocations(): Promise<LocationModel[]> {
    return await getLocationCollection().find({}).toArray();
}

export async function getAllowedLocations(user: UserModel): Promise<LocationModel[]> {
    const locations: LocationModel[] = await getLocations();
    const allowedLocations = locations.filter(location => isAllowedForLocation(user, location));
    return allowedLocations;
}

export async function createLocation(location: LocationModel): Promise<void> {
    await getLocationCollection().insertOne({
        ...location,
        _id: uuid()
    });
}
