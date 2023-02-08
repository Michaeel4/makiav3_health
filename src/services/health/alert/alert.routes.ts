import { requireAdmin } from '../../../middleware/auth.middleware';
import express from 'express';
import { EmailReceiver } from '../../../models/health/email-receiver.model';
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

alertRoutes.get('/alert/test_ping', async (req, res) => {
    res.json({ message: 'pong' });
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
