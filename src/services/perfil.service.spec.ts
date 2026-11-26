import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PerfilService } from './perfil.service';
import { User } from '../model/User';
import { EditPerfilDTO } from '../model/EditPerfilDTO';
import { UserPhoto } from '../model/UserPhoto';
import { CasualGame } from '../model/CasualGame';

describe('PerfilService', () => {
  let service: PerfilService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(PerfilService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getById should GET the user by id', () => {
    const user = new User(5, 'Rafael', 'Ala', '14999999999', 0, 1, 'Rua A', 2, true);
    let result: User | undefined;

    service.getById(5).subscribe(data => (result = data));

    const req = httpMock.expectOne(`${apiUrl}usuario/get-by-id/5`);
    expect(req.request.method).toBe('GET');
    req.flush(user);

    expect(result).toEqual(user);
  });

  it('getNextGame should GET the next game for the user and coordinates', () => {
    const game = new CasualGame(1, 'Racha', 'Desc', 'Futebol', 'Quadra A', '10', -49, -22, 3, 1.5, 'url', 1, '2026-11-29');
    let result: CasualGame | undefined;

    service.getNextGame(5, -22.3, -49.06).subscribe(data => (result = data));

    const req = httpMock.expectOne(`${apiUrl}base-games/next-game/5/-22.3/-49.06`);
    expect(req.request.method).toBe('GET');
    req.flush(game);

    expect(result).toEqual(game);
  });

  it('edit should PUT the profile DTO', () => {
    const dto = new EditPerfilDTO('Rafael', 'Ala', 'base64', 2);

    service.edit(5, dto).subscribe();

    const req = httpMock.expectOne(`${apiUrl}usuario/edit/5`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(dto);
    req.flush({});
  });

  it('getPhoto should GET the user photo', () => {
    const photo = new UserPhoto('abc');
    let result: UserPhoto | undefined;

    service.getPhoto(5).subscribe(data => (result = data));

    const req = httpMock.expectOne(`${apiUrl}usuario/get-photo/5`);
    expect(req.request.method).toBe('GET');
    req.flush(photo);

    expect(result).toEqual(photo);
  });
});
