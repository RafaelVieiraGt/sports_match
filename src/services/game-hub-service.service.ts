import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OpenGame } from '../model/OpenGame';

@Injectable({
  providedIn: 'root'
})
export class GameHubServiceService {

  private apiUrl = 'http://localhost:8080/';  // URL da API
  private data: any;

  constructor(private http: HttpClient) { }

  getAllGames(latitude: number, longitude: number) : Observable<any> {
    return this.http.get(this.apiUrl + `base-games/all/${latitude}/${longitude}`)
  }

  saveOpenGame(userId: number, position: number, openGame: OpenGame): Observable<any> {
    return this.http.post(this.apiUrl + `open-game/${userId}/${position}`, openGame)
  }

  participate(userId: number, position: number, opengameId: number): Observable<any> {
    return this.http.post(this.apiUrl + `open-game/participar/${userId}/${opengameId}/${position}`, null)
  }
  
}
