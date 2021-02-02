import bodyParser = require('body-parser');
import cors = require('cors');
import express = require('express');
import {initMongoDb} from './services/mongodb.service';
import {locationRoutes} from "./services/location.service";
import { deviceRoutes } from './services/device.service';
import { clientRoutes } from './services/client.service';
import fileUpload from 'express-fileupload';
import { userRoutes } from './services/user.service';
import passport from 'passport';
import { initPassportStrategies } from './middleware/passport';
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

        this.app.listen(3003);
        console.log(`Server started at port 3003`);
    }

}
const dateRegex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/;

function reviveDates(key: string, value: any) {
    let match;
    if (typeof value === 'string' && (match = value.match(dateRegex))) {
        const milliseconds = Date.parse(match[0]);
        if (!isNaN(milliseconds)) {
            return new Date(milliseconds);
        }
    }
    return value;
}
