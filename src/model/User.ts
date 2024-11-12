export class User {
    userId: number;
    userName: string;
    userDescription: string;
    userEmail: string;
    userPassword: string;
    userPhone: string;
    userActualTeam: number;
    address: number;
    addressStreet: string;
    userFavPosition: number;

    constructor(
        userId: number,
        userName: string,
        userDescription: string,
        userEmail: string,
        userPassword: string,
        userPhone: string,
        userActualTeam: number,
        address: number,
        addressStreet: string,
        userFavPosition: number
    ) {
        this.userId = userId;
        this.userName = userName;
        this.userDescription = userDescription;
        this.userEmail = userEmail;
        this.userPassword = userPassword;
        this.userPhone = userPhone;
        this.userActualTeam = userActualTeam;
        this.address = address;
        this.addressStreet = addressStreet;
        this.userFavPosition = userFavPosition;
    }
}