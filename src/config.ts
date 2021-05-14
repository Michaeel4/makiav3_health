export interface HealthCheckServerConfig {
    uploadDirs: {
        meat: string;
    };
    jwtSecret: string;
    bcryptRounds: number;
    gyroSmoothingFactor: number;
    timeoutInMs: number;
}

export const config: HealthCheckServerConfig = {
    uploadDirs: {
        meat: '/home/meat/images'
    },
    jwtSecret: '66F6943FEC7755A2788F756839A54E',
    bcryptRounds: 12,
    gyroSmoothingFactor: 0.95,
    timeoutInMs: 300000
}
