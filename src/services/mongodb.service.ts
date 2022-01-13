import { Collection, MongoClient } from 'mongodb';

let mongoClient: MongoClient | undefined;

export async function initMongoDb(): Promise<void> {
    mongoClient = await MongoClient.connect('mongodb://localhost:27017');
    console.log('Connected to mongo.');
}

export function getDeviceCollection(): Collection {
    if (!mongoClient) {
        throw new Error('Mongo not connected!');
    }
    return mongoClient.db('healthcheck').collection('device');
}

export function getEmailReceiverCollection(): Collection {
    if (!mongoClient) {
        throw new Error('Mongo not connected!');
    }
    return mongoClient.db('healthcheck').collection('email');
}


export function getLocationCollection(): Collection {
    if (!mongoClient) {
        throw new Error('Mongo not connected!');
    }
    return mongoClient.db('healthcheck').collection('location');
}

export function getUserCollection(): Collection {
    if (!mongoClient) {
        throw new Error('Mongo not connected!');
    }
    return mongoClient.db('healthcheck').collection('user');
}

export function getInventoryCollection(): Collection {
    if (!mongoClient) {
        throw new Error('Mongo not connected!');
    }
    return mongoClient.db('healthcheck').collection('inventory');
}

export function getProjectCollection(): Collection {
    if (!mongoClient) {
        throw new Error('Mongo not connected!');
    }
    return mongoClient.db('healthcheck').collection('project');
}

export function getAlertCollection(): Collection {
    if (!mongoClient) {
        throw new Error('Mongo not connected!');
    }
    return mongoClient.db('healthcheck').collection('alert');
}

export function getMeatCollection(): Collection {
    if (!mongoClient) {
        throw new Error('Mongo not connected!');
    }
    return mongoClient.db('meat').collection('meat');
}

export function getRockCollection(): Collection {
    if (!mongoClient) {
        throw new Error('Mongo not connected!');
    }
    return mongoClient.db('rock').collection('rock');
}


export { mongoClient };
