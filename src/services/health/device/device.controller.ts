import { UserModel } from '../../../models/health/user.model';
import { DeviceModel } from '../../../models/health/device.model';
import { getDeviceCollection } from '../../mongodb.service';
import { v4 as uuid } from 'uuid';
import { CommandModel } from '../../../models/health/ping.model';
import { getAllowedLocations } from '../location/location.controller';

export async function isAllowedForDevice(user: UserModel, device: DeviceModel): Promise<boolean> {
    const allowedLocations = await getAllowedLocations(user);
    return user.permissions.allowedDevices.includes(device._id!) || allowedLocations.findIndex(location => location._id === device.locationId) > -1;
}

export async function getNewDeviceSerial(): Promise<number> {
    return (await getDeviceCollection().find({}).sort({serial: -1}).limit(1).toArray())[0].serial + 1;
}

export async function createDevice(device: DeviceModel): Promise<void> {
    await getDeviceCollection().insertOne({
        ...device,
        _id: uuid(),
        serial: await getNewDeviceSerial()
    } as any);
}

export async function deleteDevice(device: DeviceModel): Promise<void> {
    await getDeviceCollection().deleteOne({_id: device._id});
}

export async function updateDevice(device: DeviceModel): Promise<void> {
    await getDeviceCollection().replaceOne({_id: device._id}, device);
}

async function getDevices(): Promise<DeviceModel[]> {
    return await getDeviceCollection().find<DeviceModel>({}).toArray();
}


export async function getAllowedDevices(user: UserModel): Promise<DeviceModel[]> {
    const devices: DeviceModel[] = await getDevices();
    return (await Promise.all(devices.map(async device => {
        return await isAllowedForDevice(user, device) ? device : null;
    }))).filter(d => d) as DeviceModel[];
}


export async function getDeviceById(id: string): Promise<DeviceModel | null> {
    return await getDeviceCollection().findOne<DeviceModel>({_id: id});
}

export async function rebootDevice(device: DeviceModel): Promise<void> {
    await getDeviceCollection().updateOne({_id: device._id}, {
        $set: {
            'lastPing.command': CommandModel.REBOOT
        }
    });
}

export async function calibrateDevice(device: DeviceModel): Promise<void> {
    await getDeviceCollection().updateOne({_id: device._id}, {
        $set: {
            'gyroCalibration': device?.lastPing?.gyroData
        }
    });
}

export async function restartClientProcess(device: DeviceModel, processName: string) {
    await getDeviceCollection().updateOne({_id: device._id}, {
        $set: {
            'lastPing.command': CommandModel.RESTART_PROCESS,
            'lastPing.commandArgs': processName
        }
    });
}

