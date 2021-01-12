import { DeviceStatus } from './device-status.enum';

export interface DeviceModel {
    _id?: string;
    locationId: string;
    name: string;
    status: DeviceStatus;
    host: string;
}
