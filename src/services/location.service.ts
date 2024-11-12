import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Place } from '../model/Place';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiUrl = 'http://localhost:8080/';  // URL da API
  private data: any;

  constructor(private http: HttpClient) { }

  getAllLocations(latitude: number, longitude: number): Observable<Place[]> {
    return this.http.get<Place[]>(this.apiUrl + `place/all/${latitude}/${longitude}`)
  }

  saveLocation(place: Place): Observable<Place> {
    return this.http.post<Place>(this.apiUrl + "place", place)
  }
}