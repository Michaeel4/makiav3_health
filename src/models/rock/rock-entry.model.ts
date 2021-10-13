export interface RockEntryModel {
    _id?: string;
    creationDate: Date;
    classificationManually?: RockClassification;
    classificationAutomatic?: RockClassification;
    images: string[];
}

export interface RockClassification {
    gefaehrdungsklasse: Gefaehrdungsklasse;
    gebirgsverhaltenstyp: Gebirgsverhaltenstyp;
    bergwassereinfluss: Bergwassereinfluss;
    vegetationseinfluss: Vegetationseinfluss;
}

export enum Gefaehrdungsklasse {
    SehrGering = 'SEHR_GERING', Gering = 'GERING', Mittel = 'MITTEL', Hoch = 'HOCH'
}

export enum Gebirgsverhaltenstyp{
    Standfest = 'STANDFEST', Nachbruechig = "NACHBRUECHIG", Aufgelockert = 'AUFGELOCKERT', Zerlegt = 'ZERLEGT'
}

export enum Bergwassereinfluss {
    Kein = 'KEIN', Gering = 'GERING', Hoch = 'HOCH'
}

export enum Vegetationseinfluss {
    Kein = 'KEIN', PosiRv = 'POSI_RV', NegaRv = 'NEGA_RV'
}
