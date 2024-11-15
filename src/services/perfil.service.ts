import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/User';
import { CasualGame } from '../model/CasualGame';
import { EditPerfilDTO } from '../model/EditPerfilDTO';
import { UserPhoto } from '../model/UserPhoto';

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

  edit(userId: number, dto: EditPerfilDTO): Observable<any> {
    return this.http.put(this.apiUrl + `usuario/edit/${userId}`, dto)
  }

  getPhoto(userId: number): Observable<UserPhoto> {
    return this.http.get<UserPhoto>(this.apiUrl + `usuario/get-photo/${userId}`)
  }
}
