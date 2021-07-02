import { Condition, FilterQuery } from 'mongodb';
import {MeatEntryModel, MeatType} from "./meat.model";

export interface MeatFilterModel {
  locationId?: string;
  dateRange?: {
      start: Date;
      end: Date;
  };
  types?: MeatType[];
  labelled?: boolean;
}


