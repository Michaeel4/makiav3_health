import { DiseaseModel } from './disease.model';

export interface MeatEntryModel {
    _id?: string;
    timeEnter: Date;
    timeLeave: Date;
    type: MeatType;
    locationId: string;
    slaughterId: number;
    diseasesManually?: DiseaseModel[];
    diseasesAutomatic?: DiseaseModel[];
    cameras?: CameraModel[];
}

export enum CameraType {
    PigCounter = 'PIG_COUNTER',
    GeschlingeDetector = 'GESCHLINGE_DETECTOR'
}

export interface CameraModel {
    deviceId: string;
    images: string[];
}

export type MeatType = 'BEEF' | 'PORK' | 'CHICKEN';
