import { DiseaseModel } from './disease.model';

export interface MeatEntryModel {
    _id?: string;
    timeStamp: Date;
    classManually?: Classification;
    classAutomatic: Classification;
    type: MeatType;
    locationId: string;
    diseases?: DiseaseModel[];
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

export interface Classification {
    tradingClass: TradingClass;
    fatClass: FatClass;
}

export type MeatType = 'BEEF' | 'PORK' | 'CHICKEN';
export type FatClass = '1' | '2' | '3' | '4' | '5';
export type TradingClass = 'E' | 'U' | 'R' | 'O' | 'P';

export const fatClasses: FatClass[] = ['1', '2', '3', '4', '5'];
export const tradingClasses: TradingClass[] = ['E', 'U', 'R', 'O', 'P'];

export function compareEvaluation(classMan: Classification, classAuto: Classification): number[] {
    return [
        Math.abs(tradingClassToInt[classMan.tradingClass] - tradingClassToInt[classAuto.tradingClass]),
        Math.abs(classMan.fatClass.charCodeAt(0) - classAuto.fatClass.charCodeAt(0))
    ];
}

const tradingClassToInt = {
    'E': 0,
    'U': 1,
    'R': 2,
    'O': 3,
    'P': 4,
};


