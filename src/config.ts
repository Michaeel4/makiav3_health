import { CameraType } from './models/meat/meat.model';

export interface HealthCheckServerConfig {
    uploadDirs: {
        meat: string;
        meatVideos: string;
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
        meat: '/home/meat/images',
        meatVideos: '/mnt/videos/meat_upload'
    },
    jwtSecret: '66F6943FEC7755A2788F756839A54E',
    bcryptRounds: 12,
    gyroSmoothingFactor: 0.95,
    timeoutInMs: 300000
}
