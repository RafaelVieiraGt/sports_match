import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sports } from '../model/Sports';

@Injectable({
  providedIn: 'root'
})
export class SportsService {
  private apiUrl = 'http://localhost:8080/';  // URL da API
  private data: any;

  constructor(private http: HttpClient) { }

  getAllSports(): Observable<Sports[]> {
    return this.http.get<Sports[]>(this.apiUrl + "sports")
  }
}
