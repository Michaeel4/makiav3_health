import bodyParser = require('body-parser');
import cors = require('cors');
import express = require('express');
import {initMongoDb} from './services/mongodb.service';
import fileUpload from 'express-fileupload';
import passport from 'passport';
import { initPassportStrategies } from './middleware/passport';
import { locationRoutes } from './services/location/location.routes';
import { userRoutes } from './services/user/user.routes';
import { deviceRoutes } from './services/device/device.routes';
import { clientRoutes } from './services/client/client.routes';
import { inventoryRoutes } from './services/inventory/inventory.routes';
import { projectRoutes } from './services/project/project.routes';
import { reviveDates } from './utils';
import { meatRoutes } from './services/meat/meat.routes';
import { meatStatisticsRoutes } from './services/meat/meat-statistics/meat-statistics.routes';
import { emailRoutes } from './services/email/email.routes';
import { startHealthChecker } from './services/email/email.controller';
export class Server {
    private app = express();

    public async start(): Promise<void> {
        try {
            await initMongoDb();
        } catch (err) {
            console.error('Mongo init failed. ', err);
            return;
        }

        this.app.use(bodyParser.json({
            reviver: reviveDates
        }));
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(fileUpload());

        this.app.use(passport.initialize());
        initPassportStrategies();


        this.app.use(locationRoutes);
        this.app.use(deviceRoutes);
        this.app.use(userRoutes);
        this.app.use(clientRoutes);
        this.app.use(inventoryRoutes);
        this.app.use(projectRoutes);
        this.app.use(meatRoutes);
        this.app.use(meatStatisticsRoutes);
        this.app.use(emailRoutes);

        this.app.listen(3003);
        console.log(`Server started at port 3003`);


        await startHealthChecker();
        console.log('Healthchecker started!');
    }

}
