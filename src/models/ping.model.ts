import { DeviceStatus } from './device-status.enum';

export interface PingModel {
    id: string;
    status: DeviceStatus;
    timestamp: Date;
}
