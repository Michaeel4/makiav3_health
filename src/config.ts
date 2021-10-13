import { CameraType } from './models/meat/meat.model';

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
}

export interface HealthCheckClientConfig {
    serverHost: string;
    pythonTimeOutinMs: number;
    uploadDir: string;
    hasGyro: boolean;
    cameraType?: CameraType;
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
    timeoutInMs: 300000
};
