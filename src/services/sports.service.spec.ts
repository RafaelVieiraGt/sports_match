import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { SportsService } from './sports.service';
import { Sports } from '../model/Sports';

describe('SportsService', () => {
  let service: SportsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(SportsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllSports should GET all sports', () => {
    const sports = [new Sports(1, 'Futebol', 'Bola no pé'), new Sports(2, 'Basquete', 'Cesta')];
    let result: Sports[] | undefined;

    service.getAllSports().subscribe(data => (result = data));

    const req = httpMock.expectOne('http://localhost:8080/sports');
    expect(req.request.method).toBe('GET');
    req.flush(sports);

    expect(result).toEqual(sports);
  });
});
