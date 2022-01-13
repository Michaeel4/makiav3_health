export interface GyroData {
    gyro: {
        x: number;
        y: number;
        z: number;
    };
    accel: {
        x: number;
        y: number;
        z: number;
    };
    rotation: {
        x: number;
        y: number;
    };
    temp: number;
}
