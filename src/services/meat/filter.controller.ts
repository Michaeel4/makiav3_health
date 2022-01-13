import { MeatFilterModel } from '../../models/meat/meat-filter.model';
import { Condition, Filter } from 'mongodb';
import { MeatEntryModel } from '../../models/meat/meat.model';

export function buildFilter(filterModel: MeatFilterModel): Filter<MeatEntryModel> {
    let query: Filter<MeatEntryModel> = {};

    if (filterModel.locationId) {
        query = buildPointFilter(query, 'locationId', filterModel.locationId);
    }
    if (filterModel.deviceId) {
        query = buildMatchInArrayFilter(query, 'cameras', 'deviceId', filterModel.deviceId);
    }
    if (filterModel.dateRange?.start || filterModel.dateRange?.end) {
        query = buildRangeFilter(query, 'timeEnter', filterModel.dateRange.start, filterModel.dateRange.end);
    }
    if (filterModel.types) {
        query = buildMultipleFilter(query, 'type', filterModel.types);
    }
    if (filterModel.labelled !== undefined) {
        query = buildExistFilter(query, 'diseasesManually', filterModel.labelled);
    }

    return query;
}

function buildPointFilter(filterQuery: Filter<MeatEntryModel>, key: keyof MeatEntryModel, value: any): Filter<MeatEntryModel> {
    return {
        ...filterQuery,
        [key]: value
    };
}

function buildMatchInArrayFilter(filterQuery: Filter<MeatEntryModel>, key: keyof MeatEntryModel, matchKey: any, value: any): Filter<MeatEntryModel> {
    return {
        ...filterQuery,
        [key]: {$elemMatch: {[matchKey]: value}},
    };
}

function buildRangeFilter(filterQuery: Filter<MeatEntryModel>, key: keyof MeatEntryModel, startValue: any, endValue: any): Filter<MeatEntryModel> {
    const search: Condition<MeatEntryModel> = {};
    if (startValue) {
        search.$gte = startValue;
    }
    if (endValue) {
        search.$lte = endValue;
    }

    return {
        ...filterQuery,
        [key]: search
    };
}

function buildMultipleFilter(filterQuery: Filter<MeatEntryModel>, key: keyof MeatEntryModel, value: any[]): Filter<MeatEntryModel> {
    return {
        ...filterQuery,
        [key]: {
            $in: value
        }
    };
}

function buildExistFilter(filterQuery: Filter<MeatEntryModel>, key: keyof MeatEntryModel, value: boolean): Filter<MeatEntryModel> {
    return {
        ...filterQuery,
        [key]: {
            $exists: value
        }
    };
}
