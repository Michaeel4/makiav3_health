import { requireAdmin, requireUser } from '../../middleware/auth.middleware';
import { DeviceModel } from '../../models/device.model';
import { UserModel } from '../../models/user.model';
import { config } from '../../config';
import fs from 'fs';
import express from 'express';
import { EmailReceiver } from '../../models/email-receiver.model';
import { addEmailReceiver, getEmailReceivers } from './email.controller';


const emailRoutes = express.Router();

emailRoutes.post('/email', requireAdmin, async (req, res) => {
    const receiver: EmailReceiver = req.body;
    if (receiver.email?.length) {
        await addEmailReceiver(receiver.email);
        res.status(200).end();
    } else {
        res.sendStatus(400);
    }
});

emailRoutes.get('/email', requireAdmin, async (req, res) => {
    res.json(await getEmailReceivers());
});



export { emailRoutes };
