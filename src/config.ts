export interface HealthCheckServerConfig {
    uploadDirs: {
        health: string;
        meat: string;
    };
    jwtSecret: string;
    bcryptRounds: number;
    gyroSmoothingFactor: number;
}

export const config: HealthCheckServerConfig = {
    uploadDirs: {
        health: '/home/health/images',
        meat: '/home/meat/images'
    },
    jwtSecret: '66F6943FEC7755A2788F756839A54E',
    bcryptRounds: 12,
    gyroSmoothingFactor: 0.95
}
