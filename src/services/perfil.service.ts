import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/User';
import { CasualGame } from '../model/CasualGame';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  getById(userId: number): Observable<User> {
    return this.http.get<User>(this.apiUrl + `usuario/get-by-id/`+ userId);
  }

  getNextGame(latitude: number, longitude: number) {
    return this.http.get<CasualGame>(this.apiUrl + `base-games/next-game/${latitude}/${longitude}`)
  }
}
