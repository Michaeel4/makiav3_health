export interface MeatEntryModel {
    _id?: string;
    timeStamp: Date;
    classManually: Classification;
    classAutomatic: Classification;
    type: MeatType;
    images?: (string | null)[];
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
      tradingClassToInt(classMan.tradingClass) - tradingClassToInt(classAuto.tradingClass),
      classMan.fatClass.charCodeAt(0) - classAuto.fatClass.charCodeAt(0)];
  }

  function tradingClassToInt(a: string): number {
    switch (a){
      case 'E': return 0;
      case 'U': return 1;
      case 'R': return 2;
      case 'O': return 3;
      default: return 4;
    }
  }


