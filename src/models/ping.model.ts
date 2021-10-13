import { DeviceStatus } from './device-status.enum';
import { GyroData } from './gyro.model';
import { HealthCheckClientConfig } from '../config';
import { DeviceInfoModel } from './device-info.model';

export type LogInfo = { name: string, content: string };

export interface PingModel {
    id: string;
    status: DeviceStatus;
    command?: CommandModel;
    commandArgs?: any;
    timestamp: Date;
    gyroData?: GyroData;
    emailSent?: boolean;
    version: string;
    config?: HealthCheckClientConfig;
    deviceInfo?: DeviceInfoModel;
    logs?: LogInfo[];
}

export enum CommandModel {
    REBOOT = 'REBOOT', RESTART_PROCESS = 'RESTART_PROCESS'
}
