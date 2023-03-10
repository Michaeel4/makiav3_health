import { UserCredentials, UserModel, UserPermissions } from '../../models/health/user.model';
import { getUserCollection } from '../db/mongodb.service';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import { config } from '../../config';
import jwt from 'jsonwebtoken';

export async function getUsers(): Promise<UserModel[]> {
    const users = await getUserCollection().find<UserModel>({}, {}).toArray();
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
    console.log('Getting user by username', username);
    return await getUserCollection().findOne<UserModel>({
        username
    });
}

export async function registerUser(user: UserModel): Promise<string | null> {
    const existingUser = await getUserByUsername(user.username);
    const newUser: UserModel = {
        _id: uuid(),
        password: await bcrypt.hash(user.password!, config.bcryptRounds),
        username: user.username,
        name: user.name,
        admin: true,
        permissions: {
            allowedLocations: [],
            allowedProjects: [],
            allowedDevices: []
        },
        telephone: user.telephone
    };

    const success = !existingUser && !!await getUserCollection().insertOne(newUser as any);

    if (success) {
        return jwt.sign({username: user.username}, config.jwtSecret);
    }
    return null;
}

export async function loginUser(credentials: UserCredentials): Promise<string | null> {
    console.log('Logging in user', credentials.username)
    const existingUser = await getUserByUsername(credentials.username);
    if (!existingUser || !existingUser.password) {
        console.log('User not found');
        return null;
    }

    // convert credentials.password to a string

    
    const result = await bcrypt.compare(credentials.password!, existingUser.password);
    return result ? jwt.sign({username: existingUser.username}, config.jwtSecret) : null;
}

export async function updateUserPermissions(user: UserModel, permissions: UserPermissions): Promise<void> {
    await getUserCollection().updateOne({_id: user._id}, {
        $set: {
            permissions
        }
    });
}
