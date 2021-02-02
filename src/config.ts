export interface HealthCheckServerConfig {
    uploadDir: string;
    jwtSecret: string;
    bcryptRounds: number;
}

export const config: HealthCheckServerConfig = {
    uploadDir: '/home/health/images',
    jwtSecret: 'abc',
    bcryptRounds: 12
}
