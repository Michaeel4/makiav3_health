import { MeatFilterModel } from '../../models/meat/meat-filter.model';
import { Condition, FilterQuery } from 'mongodb';
import { MeatEntryModel } from '../../models/meat/meat.model';

export function buildFilter(filterModel: MeatFilterModel): FilterQuery<MeatEntryModel> {
    let query: FilterQuery<MeatEntryModel> = {};

    if (filterModel.locationId) {
        query = buildPointFilter(query, 'locationId', filterModel.locationId);
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

function buildPointFilter(filterQuery: FilterQuery<MeatEntryModel>, key: keyof MeatEntryModel, value: any): FilterQuery<MeatEntryModel> {
    return {
        ...filterQuery,
        [key]: value
    };
}

function buildRangeFilter(filterQuery: FilterQuery<MeatEntryModel>, key: keyof MeatEntryModel, startValue: any, endValue: any): FilterQuery<MeatEntryModel> {
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

function buildMultipleFilter(filterQuery: FilterQuery<MeatEntryModel>, key: keyof MeatEntryModel, value: any[]): FilterQuery<MeatEntryModel> {
    return {
        ...filterQuery,
        [key]: {
            $in: value
        }
    };
}

function buildExistFilter(filterQuery: FilterQuery<MeatEntryModel>, key: keyof MeatEntryModel, value: boolean): FilterQuery<MeatEntryModel> {
    return {
        ...filterQuery,
        [key]: {
            $exists: value
        }
    };
}
