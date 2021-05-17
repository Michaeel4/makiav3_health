export interface DiseaseModel {
    disease: Disease;
    severity: DiseaseSeverity;
}

export enum Disease {
    Milkspots = 'MILKSPOTS',
    Perihepatitis = 'PERIHEPATITIS',
    Peritonitis = 'PERITONITIS',
    Fettleber = 'FETTLEBER',
    Lunge = 'LUNGE',
    Herz = 'HERZ',
    TK = 'TK'
}

export enum DiseaseSeverity {
    Leicht ='LEICHT',
    Mittel = 'MITTEL',
    Schwer = 'SCHWER'
}
