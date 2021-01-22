import { DeviceStatus } from './device-status.enum';
import { PingModel } from './ping.model';

export interface DeviceModel {
    _id?: string;
    locationId: string;
    name: string;
    lastPing: PingModel;
}
