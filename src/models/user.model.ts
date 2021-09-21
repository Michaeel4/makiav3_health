
export interface UserModel extends UserCredentials {
    _id?: string;
    name: string;
    telephone: string;
    admin: boolean;
    permissions: UserPermissions;
    streamSecret?: string;
    userView?: UserView;
}

export interface UserCredentials {
    username: string;
    password?: string;
}
export interface UserPermissions {
    allowedLocations: string[];
    allowedProjects: string[];
    allowedDevices: string[];
}

export enum UserView {
    AnimalWelfare = 'ANIMAL_WELFARE'
}
