import bodyParser = require('body-parser');
import cors = require('cors');
import express = require('express');
import {initMongoDb} from './services/mongodb.service';
import {locationRoutes} from "./services/location.service";

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
        this.app.options('*', cors());

        this.app.use(locationRoutes);

        this.app.listen(13337);
        console.log(`Server started at port 13337`);
    }

}
