import { getAlertCollection, getDeviceCollection, getEmailReceiverCollection } from '../../db/mongodb.service';
import { v4 as uuid } from 'uuid';
import { EmailReceiver } from '../../../models/health/email-receiver.model';
import * as nodemailer from 'nodemailer';
import { DeviceModel } from '../../../models/health/device.model';
import { DeviceStatus } from '../../../models/health/device-status.enum';
import { config } from '../../../config';
import { AlertModel } from '../../../models/health/alert.model';

export async function addAlert(device: DeviceModel, online: boolean): Promise<void> {
    // TODO: fix alerts
    /*await getAlertCollection().insertOne({
        _id: uuid(),
        timestamp: new Date(),
        device,
        online
    });*/
}

export async function getAlerts(): Promise<AlertModel[]> {
    return await getAlertCollection().find<AlertModel>({}).toArray();
}


export async function addEmailReceiver(email: string): Promise<void> {
    await getEmailReceiverCollection().insertOne({
        _id: uuid(),
        email
    } as any);
}

export async function getEmailReceivers(): Promise<EmailReceiver[]> {
    return await getEmailReceiverCollection().find<EmailReceiver>({}).toArray();
}

export async function deleteEmailReceiver(id: string): Promise<void> {
    await getEmailReceiverCollection().deleteOne({
        _id: id
    });
}

export async function sendAlertEmail(device: DeviceModel): Promise<void> {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'w00e2aa8.kasserver.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'dennis.straehhuber@chrona.com',
            pass: 'TcgAVnhThy9527BG',
        },
    });

    const receivers = await getEmailReceivers();
    await Promise.all(receivers.map(async receiver => {
        await transporter.sendMail({
            from: '"Healthcheck Alert" <dennis.straehhuber@chrona.com>', // sender address
            to: receiver.email,
            subject: '?????? Healthcheck Alert ??????',
            text: `${device.name} ist ausgefallen! Letzter Ping: ${JSON.stringify(device.lastPing)}`,
        });
        console.log(`sent email to: ${receiver.email}`);
    }));
}

let emailInterval: NodeJS.Timeout | null;

export async function startHealthChecker() {
    emailInterval = setInterval(async () => {
        const devices: DeviceModel[] = await getDeviceCollection().find<DeviceModel>({}).toArray();
        await Promise.all(devices.map(async device => {
            if (device.lastPing &&
                !device.lastPing.emailSent && (
                    (device.lastPing.status === DeviceStatus.Online && device.lastPing.timestamp < new Date(Date.now() - config.timeoutInMs))
                    || (device.lastPing.status === DeviceStatus.Warning || device.lastPing.status === DeviceStatus.Moved)
                )
            ) {
                await getDeviceCollection().updateOne({_id: device._id}, {
                    $set: {
                        'lastPing.emailSent': true
                    }
                });

                await addAlert(device, false);
                await sendAlertEmail(device);
            }
        }));

    }, 1000);
}

export async function stopHealthChecker() {
    if (emailInterval) {
        clearInterval(emailInterval);
    }
    emailInterval = null;
}
