import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PositionService } from './position.service';
import { Position } from '../model/Position';

describe('PositionService', () => {
  let service: PositionService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/';
  const positions = [new Position(1, 'Goleiro', 'Defende o gol', 1)];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(PositionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll should GET all positions', () => {
    let result: Position[] | undefined;

    service.getAll().subscribe(data => (result = data));

    const req = httpMock.expectOne(`${apiUrl}position/all`);
    expect(req.request.method).toBe('GET');
    req.flush(positions);

    expect(result).toEqual(positions);
  });

  it('findBySport should GET positions for the sport id', () => {
    let result: Position[] | undefined;

    service.findBySport(1).subscribe(data => (result = data));

    const req = httpMock.expectOne(`${apiUrl}position/1`);
    expect(req.request.method).toBe('GET');
    req.flush(positions);

    expect(result).toEqual(positions);
  });
});
