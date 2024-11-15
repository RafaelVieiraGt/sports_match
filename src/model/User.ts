export class User {
    userId: number;
    userName: string;
    userDescription: string;
    userPhone: string;
    userActualTeam: number;
    address: number;
    addressStreet: string;
    userFavPosition: number;
    active: boolean;

    constructor(
        userId: number,
        userName: string,
        userDescription: string,
        userPhone: string,
        userActualTeam: number,
        address: number,
        addressStreet: string,
        userFavPosition: number,
        active: boolean
    ) {
        this.userId = userId;
        this.userName = userName;
        this.userDescription = userDescription;
        this.userPhone = userPhone;
        this.userActualTeam = userActualTeam;
        this.address = address;
        this.addressStreet = addressStreet;
        this.userFavPosition = userFavPosition;
        this.active = active
    }
}