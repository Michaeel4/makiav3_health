import express from 'express';
import { requireAdmin, requireUser } from '../../middleware/auth.middleware';
import { UserModel } from '../../models/user.model';
import { getUserCollection } from '../mongodb.service';
import { getUserById, getUsers, loginUser, registerUser } from './user.controller';

const userRoutes = express.Router();
userRoutes.post('/register', async (req, res, next) => {
    try {
        const token = await registerUser(req.body);
        if (token) {
            res.send(token);
        } else {
            res.sendStatus(422);
        }

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

userRoutes.post('/login', (async (req, res, next) => {
    try {
        const token = await loginUser(req.body);
        if (token) {
            res.send(token);
        } else {
            res.sendStatus(403);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}));

userRoutes.get('/user', requireAdmin, (async (req, res, next) => {
    try {
        const users = await getUsers();
        res.json(users);


    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}));
userRoutes.get('/user/own', requireUser, (async (req, res, next) => {
    delete (req.user as UserModel).password;
    res.json(req.user);
}));


userRoutes.post('/user/:id/allowed', requireAdmin, (async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);
        const allowedLocations: string[] = req.body;
        if (user && allowedLocations) {
            await getUserCollection().updateOne({_id: user._id}, {
                $set: {
                    allowedLocations
                }
            });
            res.status(200).end();
        } else {
            res.sendStatus(400);
        }


    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}));


export {userRoutes}
