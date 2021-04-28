export interface MeatEntryModel {
    _id?: string;
    timeStamp: Date;
    classManually: Classification;
    classAutomatic: Classification;
    type: MeatType;
    imagesLeft?: (string | null)[];
    imagesRight?: (string | null)[];
    locationId: string;
  }

  export interface Classification {
      tradingClass: TradingClass;
      fatClass: FatClass;
  }

  export type MeatType = 'BEEF' | 'PORK' | 'CHICKEN';
  export type FatClass = '0' | '1' | '2' | '3' | '4';
  export type TradingClass = 'E' | 'U' | 'R' | 'O' | 'P';

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
  }


