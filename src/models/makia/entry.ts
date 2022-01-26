export interface MakiaEntry {
    id: number;
    timestamp: string;
    locationID: number;
    direction: MakiaDirection;
    category: MakiaVehicleType;
    stoppedForMs: number;
    avgVelocity: number;
    minVelocity: number;
    stoppedDistance: number;
    convoyIndex: number;
    convoyType: MakiaVehicleType;
    images?: string;
}

enum MakiaDirection {
    Incoming = 'INCOMING',
    Outgoing = 'OUTGOING'
}

enum MakiaVehicleType {
    Car = 'CAR',
    Truck = 'TRUCK',
    Motorcycle = 'MOTORCYCLE',
    Bus = 'BUS',
    Tractor = 'TRACTOR',
    Train = 'TRAIN'
}
