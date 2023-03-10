import bodyParser = require('body-parser');
import cors = require('cors');
import express = require('express');
import { initMongoDb } from './services/db/mongodb.service';
import fileUpload from 'express-fileupload';
import passport from 'passport';
import { initPassportStrategies } from './middleware/passport';
import { locationRoutes } from './services/health/location/location.routes';
import { userRoutes } from './services/user/user.routes';
import { deviceRoutes } from './services/health/device/device.routes';
import { clientRoutes } from './services/health/client/client.routes';
import { inventoryRoutes } from './services/health/inventory/inventory.routes';
import { projectRoutes } from './services/health/project/project.routes';
import { reviveDates } from './utils';
import { meatRoutes } from './services/meat/meat.routes';
import { alertRoutes } from './services/health/alert/alert.routes';
import { startHealthChecker } from './services/health/alert/alert.controller';
import { Mutex } from 'async-mutex';
import { rockRoutes } from './services/rock/rock.routes';
import { initMySQL } from './services/db/mysql.service';
import { makiaRoutes } from './services/makia/makia.service';

export const imageMutex = new Mutex();
export const deleteMutex = new Mutex();


export class Server {
    private app = express();

    public async start(): Promise<void> {
        try {
            await initMongoDb();
            await initMySQL();
        } catch (err) {
            console.error('DB init failed. ', err);
            return;
        }

        this.app.use(bodyParser.json({
            reviver: reviveDates
        }));
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(fileUpload({
            uploadTimeout: 0,
            limits: {
                fileSize: 1024 * 1024 * 1024
            }
        }));

        this.app.use(passport.initialize());
        initPassportStrategies();


        this.app.use(locationRoutes);
        this.app.use(deviceRoutes);
        this.app.use(userRoutes);
        this.app.use(clientRoutes);
        this.app.use(inventoryRoutes);
        this.app.use(projectRoutes);
        this.app.use(meatRoutes);
        this.app.use(rockRoutes);
        this.app.use(makiaRoutes);
        this.app.use(alertRoutes);

        this.app.listen(3003);
        console.log(`Server started at port 3003`);


        await startHealthChecker();
        console.log('Healthchecker started!');
    }

}
