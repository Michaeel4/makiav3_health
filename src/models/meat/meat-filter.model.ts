
export interface MeatFilterModel {
    locationId?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
    labelled?: boolean;
    deviceId?: string;
}


