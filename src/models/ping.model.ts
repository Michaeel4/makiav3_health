import { DeviceStatus } from './device-status.enum';
import { GyroData } from './gyro.model';

export interface PingModel {
    id: string;
    status: DeviceStatus;
    command?: CommandModel;
    timestamp: Date;
    gyroData?: GyroData;
    emailSent?: boolean;
}



export enum CommandModel {
    REBOOT = 'REBOOT'
}
