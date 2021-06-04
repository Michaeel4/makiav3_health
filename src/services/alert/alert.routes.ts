import { requireAdmin, requireUser } from '../../middleware/auth.middleware';
import { DeviceModel } from '../../models/device.model';
import { UserModel } from '../../models/user.model';
import { config } from '../../config';
import fs from 'fs';
import express from 'express';
import { EmailReceiver } from '../../models/email-receiver.model';
import { addEmailReceiver, deleteEmailReceiver, getAlerts, getEmailReceivers } from './alert.controller';


const alertRoutes = express.Router();

alertRoutes.post('/alert/email', requireAdmin, async (req, res) => {
    const receiver: EmailReceiver = req.body;
    if (receiver.email?.length) {
        await addEmailReceiver(receiver.email);
        res.status(200).end();
    } else {
        res.sendStatus(400);
    }
});

alertRoutes.get('/alert/email', requireAdmin, async (req, res) => {
    res.json(await getEmailReceivers());
});

alertRoutes.get('/alert', requireAdmin, async (req, res) => {
    res.json(await getAlerts());
});

alertRoutes.delete('/alert/email/:id', requireAdmin, async (req, res) => {
   const id = req.params.id;
   if (id) {
       await deleteEmailReceiver(id);
       res.status(200).end();
   } else {
       res.status(400).end();
   }

});


export { alertRoutes };
