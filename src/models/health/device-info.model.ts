import { NetworkInterfaceInfo } from 'os';

// copy from client package
export type DiskSpace = {
    diskPath: string;
    free: number;
    size: number;
};

export interface DeviceInfoModel {
    network: { [key: string]: NetworkInterfaceInfo[] };
    diskUsage: DiskSpace;
}
