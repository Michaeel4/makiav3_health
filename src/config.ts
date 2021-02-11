export interface HealthCheckServerConfig {
    uploadDir: string;
    jwtSecret: string;
    bcryptRounds: number;
}

export const config: HealthCheckServerConfig = {
    uploadDir: '/home/health/images',
    jwtSecret: '66F6943FEC7755A2788F756839A54E',
    bcryptRounds: 12
}
