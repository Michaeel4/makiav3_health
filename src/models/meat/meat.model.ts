
export interface MeatEntryModel {
    _id?: string;
    timeEnter: Date;
    timeLeave: Date;
    locationId: string;
    slaughterId?: number;
    classificationManually?: MeatClassification;
    cameras?: CameraModel[];
}


export enum MeatClassification {
    Gut,
    OK,
    Fragwuerdig,
    NichtOK,
}

export type MeatNeighborDirection = 'NEXT' | 'PREVIOUS' | 'NONE';

export interface CameraModel {
    deviceId: string;
    images: string[];
}
