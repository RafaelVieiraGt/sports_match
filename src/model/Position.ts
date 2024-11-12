export class Position {
    positionId: number;
    positionName: string;
    positionDesc: string;
    sport: number;

    constructor(
        positionId: number, 
        positionName: string, 
        positionDesc: string, 
        sport: number
    ) {
        this.positionId = positionId;
        this.positionName = positionName;
        this.positionDesc = positionDesc;
        this.sport = sport
    }
}