import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { UserModel } from '../models/user.model';
import { getProjectCollection } from '../services/mongodb.service';
import { getDeviceById } from '../services/device/device.controller';


export function requireUser(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', {session: false}, async (err, user: UserModel, info) => {
        if (err) {
            console.error(err);
        }
        if (info) {
            // req.log.info(info.message);
            res.send(info.message);
        } else if (user) {
            req.user = user;
            next();
        } else {
            res.status(403).end();
        }
    })(req, res, next);
}
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    requireUser(req, res, () => {
        const user: UserModel | undefined = req.user as any;
        if (user?.admin) {
            next();
        } else {
            res.status(403).end();
        }
    });
}
export async function requireDeviceToken(req: Request, res: Response, next: NextFunction) {
    const deviceToken = req.header('Authorization');
    if (deviceToken) {
        const device = await getDeviceById(deviceToken);
        if (device) {
            // @ts-ignore
            req.device = device;
            next();
        } else {
            res.status(403).end();
        }
    } else {
        res.status(403).end();
    }
}
