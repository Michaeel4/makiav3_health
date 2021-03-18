import { UserModel } from '../../models/user.model';
import { DeviceModel } from '../../models/device.model';
import { getDeviceCollection, getLocationCollection } from '../mongodb.service';
import { v4 as uuid } from 'uuid';
import { CommandModel } from '../../models/ping.model';
import { getAllowedLocations, isAllowedForLocation } from '../location/location.controller';

export async function isAllowedForDevice(user: UserModel, device: DeviceModel): Promise<boolean> {
    const allowedLocations = await getAllowedLocations(user);
    return allowedLocations.findIndex(location => location._id === device.locationId) > -1;
}

export async function createDevice(device: DeviceModel): Promise<void> {
    await getDeviceCollection().insertOne({
        ...device,
        _id: uuid()
    });
}

async function getDevices(): Promise<DeviceModel[]> {
    return await getDeviceCollection().find({}).toArray();
}


export async function getAllowedDevices(user: UserModel): Promise<DeviceModel[]> {
    const devices: DeviceModel[] = await getDevices();
    return (await Promise.all(devices.map(async device => {
        return await isAllowedForDevice(user, device) ? device : null;
    }))).filter(d => d) as DeviceModel[];
}


export async function getDeviceById(id: string): Promise<DeviceModel | null> {
    return await getDeviceCollection().findOne({_id: id});
}

export async function rebootDevice(device: DeviceModel): Promise<void> {
    await getDeviceCollection().updateOne({_id: device._id}, {
        $set: {
            "lastPing.command": CommandModel.REBOOT
        }
    });
}
export async function calibrateDevice(device: DeviceModel): Promise<void> {
    await getDeviceCollection().updateOne({_id: device._id}, {
        $set: {
            "gyroCalibration": device?.lastPing?.gyroData
        }
    });
}
