import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cep } from '../model/Cep';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  loadCep(cep: number): Observable<Cep> {
    return this.http.get<Cep>(this.apiUrl + `address/get-by-cep/${cep}`);
  }

  createAddress(cep: number): Observable<number> {
    return this.http.post<number>(this.apiUrl + `address/save-by-cep/${cep}`, null);
  }
}
