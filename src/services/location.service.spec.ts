import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { LocationService } from './location.service';
import { Place } from '../model/Place';

describe('LocationService', () => {
  let service: LocationService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(LocationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllLocations should GET places near the given coordinates', () => {
    const places = [new Place(1, 'Quadra A', 'Coberta', -49.06, -22.3)];
    let result: Place[] | undefined;

    service.getAllLocations(-22.3, -49.06).subscribe(data => (result = data));

    const req = httpMock.expectOne(`${apiUrl}place/all/-22.3/-49.06`);
    expect(req.request.method).toBe('GET');
    req.flush(places);

    expect(result).toEqual(places);
  });

  it('saveLocation should POST the place and return the saved place', () => {
    const place = new Place(1, 'Quadra A', 'Coberta', -49.06, -22.3);
    let result: Place | undefined;

    service.saveLocation(place).subscribe(data => (result = data));

    const req = httpMock.expectOne(`${apiUrl}place`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(place);
    req.flush(place);

    expect(result).toEqual(place);
  });
});
