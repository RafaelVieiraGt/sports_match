import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserDTO } from '../model/UserDTO';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }
  getUser() {
    throw new Error('Method not implemented.');
  }

  createUser(userDto: UserDTO): Observable<User> {
    return this.http.post<User>(this.apiUrl + `usuario`, userDto)
  }

  loginUser(email: string, senha: string): Observable<number> {
    return this.http.get<number>(this.apiUrl + `usuario/${email}/${senha}`)
  }
}
