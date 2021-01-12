import bodyParser = require('body-parser');
import cors = require('cors');
import express = require('express');
import {initMongoDb} from './services/mongodb.service';
import {locationRoutes} from "./services/location.service";
import { deviceRoutes } from './services/device.service';
import { authRoutes } from './services/auth.service';

export class Server {
    private app = express();

    public async start(): Promise<void> {
        try {
            await initMongoDb();
        } catch (err) {
            console.error('Mongo init failed. ', err);
            return;
        }

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(cors());

        this.app.use(locationRoutes);
        this.app.use(deviceRoutes);
        this.app.use(authRoutes);

        this.app.listen(3001);
        console.log(`Server started at port 3001`);
    }

}
