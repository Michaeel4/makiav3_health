export interface TailModel {
    length: TailLength;
    lesion: TailLesion;
    bodyLesion: BodyLesion;
}

export enum TailLength {
    Intact, Short, TooShort, Unassessable
}

export enum TailLesion {
    None, Minor, Major, Unassessable
}

export enum BodyLesion {
    Zero, One, Two, Unassessable
}
