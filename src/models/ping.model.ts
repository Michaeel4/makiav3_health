import { DeviceStatus } from './device-status.enum';
import { GyroData } from './gyro.model';
import { HealthCheckClientConfig } from '../config';

export interface PingModel {
    id: string;
    status: DeviceStatus;
    command?: CommandModel;
    timestamp: Date;
    gyroData?: GyroData;
    emailSent?: boolean;
    version: string;
    config?: HealthCheckClientConfig;
}



export enum CommandModel {
    REBOOT = 'REBOOT'
}
