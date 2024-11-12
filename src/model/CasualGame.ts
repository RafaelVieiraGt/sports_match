
export class CasualGame {
    openGameId: number;
    openGameTitle: string;
    openGameDescription: string;
    sport: string;
    placeName: string;
    maxPlayers: string;
    gameLongitude: number;
    gameLatitude: number;
    actualPlayers: number;
    realDistance: number;
    urlPhoto: string;
    sportId: number;
    date: string;

    constructor(
        openGameId: number,
        openGameTitle: string,
        openGameDescription: string,
        sport: string,
        placeName: string,
        maxPlayers: string,
        gameLongitude: number,
        gameLatitude: number,
        actualPlayers: number,
        realDistance: number,
        urlPhoto: string,
        sportId: number,
        date: string
    ) {
        this.openGameId = openGameId;
        this.openGameTitle = openGameTitle;
        this.openGameDescription = openGameDescription;
        this.sport = sport;
        this.placeName = placeName;
        this.maxPlayers = maxPlayers;
        this.gameLongitude = gameLongitude;
        this.gameLatitude = gameLatitude;
        this.actualPlayers = actualPlayers;
        this.realDistance = realDistance;
        this.urlPhoto = urlPhoto;
        this.sportId = sportId;
        this.date = date
    }
}