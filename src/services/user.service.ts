import { getUserCollection } from './mongodb.service';
import {v4 as uuid} from 'uuid';
import bcrypt from 'bcrypt';
import { config } from '../config';
import jwt from 'jsonwebtoken';
import express from 'express';
import { UserCredentials, UserModel } from '../models/user.model';
import { requireAdmin, requireUser } from '../middleware/auth.middleware';

export async function getUsers(): Promise<UserModel[]> {
    const users = await getUserCollection().find<UserModel>({}).toArray();
    return users.map(u => {
        delete u.password;
        return u;
    });
}

export async function getUserById(id?: string): Promise<UserModel | null> {
    return await getUserCollection().findOne<UserModel>({
        _id: id
    });
}

export async function getUserByUsername(username: string): Promise<UserModel | null> {
    return await getUserCollection().findOne<UserModel>({
        username
    });
}

export async function registerUser(user: UserModel): Promise<string | null> {
    const existingUser = await getUserByUsername(user.username);
    const newUser: UserModel = {
        _id: uuid(),
        password: await bcrypt.hash(user.password, config.bcryptRounds),
        username: user.username,
        name: user.name,
        admin: false,
        allowedLocations: [],
        telephone: user.telephone

    }

    const success = !existingUser && !!await getUserCollection().insertOne(newUser);

    if (success) {
        return jwt.sign({username: user.username}, config.jwtSecret);
    }
    return null;
}
export async function loginUser(credentials: UserCredentials): Promise<string | null> {
    const existingUser = await getUserByUsername(credentials.username);
    if (!existingUser || !existingUser.password) {
        return null;
    }
    const result = await bcrypt.compare(credentials.password, existingUser.password);
    return result ? jwt.sign({username: existingUser.username}, config.jwtSecret) : null;
}


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
