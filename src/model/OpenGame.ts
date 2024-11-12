export class OpenGame {
    opengameId: number;
    opengameTitle: string;
    opengameDesc: string;
    sport: number;
    maxPlayers: number;
    opengameDay: Date;
    opengameLocation: number

    constructor(
        opengameId: number,
        opengameTitle: string,
        opengameDesc: string,
        sport: number,
        maxPlayers: number,
        opengameDay: Date,
        opengameLocation: number
    ) {
        this.opengameId = opengameId;
        this.opengameTitle = opengameTitle;
        this.opengameDesc = opengameDesc;
        this.sport = sport;
        this.maxPlayers = maxPlayers;
        this.opengameDay = opengameDay;
        this.opengameLocation = opengameLocation;
    }
}