import { DeviceStatus } from './device-status.enum';

export interface PingModel {
    id: string;
    status: DeviceStatus;
    command?: CommandModel;
    timestamp: Date;
}

export enum CommandModel {
    REBOOT = 'REBOOT'
}