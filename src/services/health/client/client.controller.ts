import { getDeviceCollection } from '../../db/mongodb.service';
import { PingModel } from '../../../models/health/ping.model';
import { DeviceModel } from '../../../models/health/device.model';
import { config } from '../../../config';
import { DeviceStatus } from '../../../models/health/device-status.enum';
import { addAlert } from '../alert/alert.controller';
import { updateDevice } from '../device/device.controller';


export const imagesForDevice: { [deviceId: string]: Buffer } = {};

export async function updateDevicePing(ping: PingModel, device: DeviceModel): Promise<void> {

    if (ping.config) {
        device.clientConfig = ping.config;
        await updateDevice(device);
    }
    if (ping.deviceInfo) {
        device.deviceInfo = ping.deviceInfo;
        await updateDevice(device);
    }

    const oldDevice = await getDeviceCollection().findOne<DeviceModel>({
        _id: ping.id
    });

    const gyro1 = oldDevice?.lastPing?.gyroData;
    const gyro2 = ping.gyroData;

    if (gyro1 && gyro2) {
        ping.gyroData = {
            gyro: {
                x: (gyro1.gyro.x * config.gyroSmoothingFactor) + (gyro2.gyro.x * (1 - config.gyroSmoothingFactor)),
                y: (gyro1.gyro.y * config.gyroSmoothingFactor) + (gyro2.gyro.y * (1 - config.gyroSmoothingFactor)),
                z: (gyro1.gyro.z * config.gyroSmoothingFactor) + (gyro2.gyro.z * (1 - config.gyroSmoothingFactor)),
            },
            accel: {
                x: (gyro1.accel.x * config.gyroSmoothingFactor) + (gyro2.accel.x * (1 - config.gyroSmoothingFactor)),
                y: (gyro1.accel.y * config.gyroSmoothingFactor) + (gyro2.accel.y * (1 - config.gyroSmoothingFactor)),
                z: (gyro1.accel.z * config.gyroSmoothingFactor) + (gyro2.accel.z * (1 - config.gyroSmoothingFactor)),
            },
            rotation: {
                x: (gyro1.rotation.x * config.gyroSmoothingFactor) + (gyro2.rotation.x * (1 - config.gyroSmoothingFactor)),
                y: (gyro1.rotation.y * config.gyroSmoothingFactor) + (gyro2.rotation.y * (1 - config.gyroSmoothingFactor)),
            },
            temp: (gyro1.temp * config.gyroSmoothingFactor) + (gyro2.temp * (1 - config.gyroSmoothingFactor))
        };
    }

    if (oldDevice?.lastPing?.emailSent && ping.status === DeviceStatus.Online && ping.timestamp >= new Date(Date.now() - config.timeoutInMs)) {
        await addAlert(oldDevice, true);
        oldDevice.lastPing.emailSent = false;
    }

    if (oldDevice?.lastPing?.status === ping.status) {
        ping.emailSent = oldDevice?.lastPing.emailSent;
    }

    await getDeviceCollection().updateOne({_id: ping.id}, {
        $set: {
            lastPing: ping
        }
    });
}


