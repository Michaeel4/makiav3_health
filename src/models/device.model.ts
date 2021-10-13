import { PingModel } from './ping.model';
import { GyroData } from './gyro.model';
import { HealthCheckClientConfig } from '../config';
import { DeviceInfoModel } from './device-info.model';

export interface DeviceModel {
    _id?: string;
    locationId: string;
    name: string;
    serial?: number;
    lastPing?: PingModel;
    gyroCalibration?: GyroData;
    clientConfig?: HealthCheckClientConfig;
    deviceInfo?: DeviceInfoModel;
    isCurrentlyUploadingVideo: boolean;
}
