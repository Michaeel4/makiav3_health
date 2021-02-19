import { Condition, FilterQuery } from 'mongodb';
import {FatClass, MeatEntryModel, MeatType, TradingClass} from "./meat.model";

export interface MeatFilterModel {
  locationId?: string;
  dateRange?: {
      start: Date;
      end: Date;
  };
  types?: MeatType[];
  tradingClasses?: TradingClass[];
  fatClasses?: FatClass[];
}


