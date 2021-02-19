import { getDeviceCollection } from '../mongodb.service';
import { PingModel } from '../../models/ping.model';

export async function updateDevicePing(ping: PingModel): Promise<void> {
    await getDeviceCollection().updateOne({_id: ping.id}, {
        $set: {
            lastPing: ping
        }
    });
}
