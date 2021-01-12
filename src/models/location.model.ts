export interface LocationModel {
    _id?: string;
    name: string;
    address: {
        street: string;
        zipcode: string;
        city: string;
        country: string;
    }
}

