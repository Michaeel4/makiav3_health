import { DeviceStatus } from './device-status.enum';
import { PingModel } from './ping.model';
import { GyroData } from './gyro.model';

export interface DeviceModel {
    _id?: string;
    locationId: string;
    name: string;
    lastPing: PingModel;
    gyroCalibration?: GyroData;
}
