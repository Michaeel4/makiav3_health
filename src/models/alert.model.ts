import { DeviceModel } from './device.model';

export interface AlertModel {
    _id: string;
    timestamp: Date;
    device: DeviceModel;
}
