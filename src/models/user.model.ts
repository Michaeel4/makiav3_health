
export interface UserModel extends UserCredentials {
    _id?: string;
    name: string;
    telephone: string;
    admin: boolean;
    allowedLocations: string[];
}

export interface UserCredentials {
    username: string;
    password?: string;
}
