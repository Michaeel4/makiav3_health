export interface LocationModel {
    _id?: string;
    name: string;
    address: LocationAddressModel;
}

export interface LocationAddressModel {
    street: string;
    zipcode: string;
    city: string;
    country: string;
}

