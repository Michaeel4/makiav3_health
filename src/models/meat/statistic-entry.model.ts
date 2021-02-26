export interface StatisticEntryModel {
    rowName: RowName,
    offsets: number[];
}

export enum RowName {
    TradingClass = 'TRADING_CLASS',
    FatClass = 'FAT_CLASS',
    Total = 'TOTAL'
}
