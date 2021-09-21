import express from 'express';
import { requireAdmin, requireUser } from '../../middleware/auth.middleware';
import { UserModel, UserPermissions, UserView } from '../../models/user.model';
import { getUserCollection } from '../mongodb.service';
import {
    getUserById,
    getUsers,
    loginUser,
    registerUser,
    updateUserPermissions, updateUserView
} from './user.controller';
import { streamSecret } from '../../server';

const userRoutes = express.Router();
userRoutes.post('/register', requireAdmin, async (req, res, next) => {
    try {
        const token = await registerUser(req.body);
        if (token) {
            res.status(200).end();
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
    (req.user as any).streamSecret = streamSecret;
    res.json(req.user);
}));


userRoutes.post('/user/:id/permissions', requireAdmin, (async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);
        const permissions: UserPermissions = req.body;
        if (user && permissions) {
            await updateUserPermissions(user, permissions);
            res.status(200).end();
        } else {
            res.sendStatus(400);
        }


    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}));

userRoutes.post('/user/:id/views', requireAdmin, (async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);
        const view: UserView = req.body?.view;
        if (user) {
            await updateUserView(user, view);
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
