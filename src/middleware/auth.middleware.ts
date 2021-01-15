import { NextFunction, Request, Response } from 'express';
import { CredentialsModel } from '../models/credentials.model';



const API_TOKEN = 'ngiWZumJeEww4Q6tLt2pYi5W9Damk8';
const users: CredentialsModel[] = [
    {
        user: 'danny',
        password: 'vK4HbZu48bCMV6dRoQGz'
    },
    {
        user: 'christoph',
        password: 'VY75QPyKV5C8tzyVi8UL'
    },
    {
        user: 'wolfgang',
        password: 'BqLLtkm6hu56G4S6EF3S'
    },
    {
        user: 'felix',
        password: 'sabLbM9ogLBxzzCUVQmA'
    }
];

export function requireToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Token');
    if (token === API_TOKEN) {
        next();
    } else {
        res.status(403).end();
    }
}

export function authenticate(credentials: CredentialsModel): string | null {
    return users.some(user => user.user === credentials.user && user.password === credentials.password)
        ? API_TOKEN : null;
}
