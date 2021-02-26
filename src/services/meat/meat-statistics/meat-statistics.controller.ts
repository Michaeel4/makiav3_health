import { RowName, StatisticEntryModel } from '../../../models/meat/statistic-entry.model';
import { getMeatEntries } from '../meat.controller';
import { compareEvaluation } from '../../../models/meat/meat.model';

export async function calculateStatistic(locationId: string): Promise<StatisticEntryModel[]> {
    const entries = await getMeatEntries({locationId});

    const statistics: StatisticEntryModel[] = [RowName.TradingClass, RowName.FatClass, RowName.Total].map(rowName => {
       return {
           rowName,
           offsets: [0, 0, 0, 0, 0]
       }
    });


    entries.forEach(entry => {
        const evaluation = compareEvaluation(entry.classManually, entry.classAutomatic);
        statistics[0].offsets[Math.min(evaluation[0], 4)]++;
        statistics[1].offsets[Math.min(evaluation[1], 4)]++;
        statistics[2].offsets[Math.min(evaluation[0] + evaluation[1], 4)]++;
    });

    statistics.forEach(stat => {
        stat.offsets = stat.offsets.map(offset => offset / entries.length);
    });

    return statistics;

}
