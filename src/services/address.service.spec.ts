import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AddressService } from './address.service';
import { Cep } from '../model/Cep';

describe('AddressService', () => {
  let service: AddressService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AddressService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loadCep should GET the address for the given CEP', () => {
    const cep = new Cep('17012-000', 'Rua Teste', 'Bauru', 'SP');
    let result: Cep | undefined;

    service.loadCep(17012000).subscribe(data => (result = data));

    const req = httpMock.expectOne(`${apiUrl}address/get-by-cep/17012000`);
    expect(req.request.method).toBe('GET');
    req.flush(cep);

    expect(result).toEqual(cep);
  });

  it('createAddress should POST to save-by-cep with a null body and return the id', () => {
    let result: number | undefined;

    service.createAddress(17012000).subscribe(data => (result = data));

    const req = httpMock.expectOne(`${apiUrl}address/save-by-cep/17012000`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush(15);

    expect(result).toBe(15);
  });
});
