import { PoolConfig } from 'promise-mysql';


export const mysqlConfig: PoolConfig = {
    host: 'localhost',
    port: 3306,
    database: 'makia', // e.g. 'my-database',
    user: 'root', // e.g. 'my-db-user'
    password: 'dnhD7skVghZjxWrU2SOKnzw2pOurOG!', //'zr0vbR95lpTPZPKn', //, // , // , // e.g. 'my-db-password'
    connectionLimit: 1,
    connectTimeout: 10000, // 10 seconds
    acquireTimeout: 10000, // 10 seconds,
};

export interface HealthCheckServerConfig {
    uploadDirs: {
        meatImages: string;
        meatVideos: string;
        rockImages: string;
    };
    jwtSecret: string;
    bcryptRounds: number;
    gyroSmoothingFactor: number;
    timeoutInMs: number;
    numberPlateUrl: string;
}

export interface HealthCheckClientConfig {
    serverHost: string;
    pythonTimeOutinMs: number;
    uploadDir: string;
    hasGyro: boolean;
}


export const config: HealthCheckServerConfig = {
    uploadDirs: {
        meatImages: '/mnt/images/meat',
        meatVideos: '/mnt/videos/meat_upload',
        rockImages: '/mnt/images/rock'
    },
    jwtSecret: '66F6943FEC7755A2788F756839A54E',
    bcryptRounds: 12,
    gyroSmoothingFactor: 0.95,
    timeoutInMs: 300000,
    numberPlateUrl: 'http://172.25.138.89:5000/image'
};
