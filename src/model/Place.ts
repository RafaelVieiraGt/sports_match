
export class Place {

    placeId: number;
    placeName: string;
    placeDesc: string;
    placeLongitude: number;
    placeLatitude: number;

    constructor(
        placeId: number,
        placeName: string,
        placeDesc: string,
        placeLongitude: number,
        placeLatitude: number,
    ) {
        this.placeId = placeId;
        this.placeName = placeName;
        this.placeDesc = placeDesc;
        this.placeLongitude = placeLongitude;
        this.placeLatitude = placeLatitude;
    }
}