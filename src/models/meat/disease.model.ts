export interface DiseaseModel {
    diseaseGroup: DiseaseGroup;
    disease: Disease;
    severity: DiseaseSeverity;
}

export enum DiseaseGroup {
    Leber = 'LEBER',
    Lunge = 'LUNGE',
    Herz = 'HERZ',
    TK = 'TK'
}

export enum Disease {
    Milkspots = 'MILKSPOTS',
    Perihepatitis = 'PERIHEPATITIS',
    Peritonitis = 'PERITONITIS',
    Fettleber = 'FETTLEBER',
    Pneumonie = 'PNEUMONIE',
    Pleuritis = 'PLEURITIS',
    Blutfuelle = 'BLUTFÜLLE',
    Epicarditis = 'EPICARDITIS',
    Pericarditits = 'PERICARDITIS',
    Polyserositis = 'POLYSEROSITIS',
    Arthritis = 'ARTHRITIS',
    PSE = 'PSE',
    HD = 'HD',
    Abszess = 'ABSZESS',
    MasSchaden = 'MAS.SCHADEN',
    Kratzspuren = 'KRATZSPUREN'
}

export const diseasesForGroup: {[group in DiseaseGroup]: Disease[]} = {
    [DiseaseGroup.Leber]: [
        Disease.Milkspots,
        Disease.Perihepatitis,
        Disease.Peritonitis,
        Disease.Fettleber,
    ],
   [DiseaseGroup.Lunge]: [
       Disease.Pneumonie,
       Disease.Pleuritis,
       Disease.Blutfuelle
   ],
    [DiseaseGroup.Herz]: [
        Disease.Epicarditis,
        Disease.Pericarditits,
        Disease.Polyserositis
    ],
    [DiseaseGroup.TK]: [
        Disease.Arthritis,
        Disease.PSE,
        Disease.HD,
        Disease.Abszess,
        Disease.MasSchaden,
        Disease.Kratzspuren
    ]
}

export enum DiseaseSeverity {
    Leicht ='LEICHT',
    Mittel = 'MITTEL',
    Schwer = 'SCHWER'
}
