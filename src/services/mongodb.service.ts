import * as mongodb from 'mongodb';

let mongoClient: mongodb.MongoClient | undefined;

export async function initMongoDb(): Promise<void> {
    mongoClient = await mongodb.connect("mongodb://localhost:27017", {useUnifiedTopology: true});
    console.log('Connected to mongo.');
}

export function getDeviceCollection(): mongodb.Collection {
    if (!mongoClient) {
        throw new Error('Mongo not connected!');
    }
    return mongoClient.db("healthcheck").collection('device');
}

export function getLocationCollection(): mongodb.Collection {
    if (!mongoClient) {
        throw new Error('Mongo not connected!');
    }
    return mongoClient.db("healthcheck").collection('location');
}

export function getUserCollection(): mongodb.Collection {
    if (!mongoClient) {
        throw new Error('Mongo not connected!');
    }
    return mongoClient.db("healthcheck").collection('user');
}

export function getInventoryCollection(): mongodb.Collection {
    if (!mongoClient) {
        throw new Error('Mongo not connected!');
    }
    return mongoClient.db("healthcheck").collection('inventory');
}
export function getProjectCollection(): mongodb.Collection {
    if (!mongoClient) {
        throw new Error('Mongo not connected!');
    }
    return mongoClient.db("healthcheck").collection('project');
}

export function getMeatCollection(): mongodb.Collection {
    if (!mongoClient) {
        throw new Error('Mongo not connected!');
    }
    return mongoClient.db("meat").collection('meat');
}


export {mongoClient};
