import { RowName, StatisticEntryModel } from '../../../models/meat/statistic-entry.model';
import { getMeatEntries } from '../meat.controller';

export async function calculateStatistic(locationId: string): Promise<StatisticEntryModel[]> {
    const entries = await getMeatEntries({locationId, labelled: true});

    const statistics: StatisticEntryModel[] = [RowName.TradingClass, RowName.FatClass, RowName.Total].map(rowName => {
        return {
            rowName,
            offsets: [0, 0, 0, 0, 0]
        };
    });


    entries.forEach(entry => {
        const evaluation = [0, 0]; //compareEvaluation(entry.diseasesManually!, entry.diseasesAutomatic);
        statistics[0].offsets[Math.min(evaluation[0], 4)]++;
        statistics[1].offsets[Math.min(evaluation[1], 4)]++;
        statistics[2].offsets[Math.min(evaluation[0] + evaluation[1], 4)]++;
    });

    statistics.forEach(stat => {
        stat.offsets = stat.offsets.map(offset => offset / entries.length);
    });

    return statistics;

}
