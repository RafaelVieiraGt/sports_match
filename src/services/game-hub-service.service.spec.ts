import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { GameHubServiceService } from './game-hub-service.service';
import { OpenGame } from '../model/OpenGame';

describe('GameHubServiceService', () => {
  let service: GameHubServiceService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(GameHubServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllGames should GET games near the given coordinates', () => {
    const games = [{ openGameId: 1 }, { openGameId: 2 }];
    let result: unknown;

    service.getAllGames(-22.3, -49.06).subscribe(data => (result = data));

    const req = httpMock.expectOne(`${apiUrl}base-games/all/-22.3/-49.06`);
    expect(req.request.method).toBe('GET');
    req.flush(games);

    expect(result).toEqual(games);
  });

  it('saveOpenGame should POST the game for the user and position', () => {
    const game = new OpenGame(1, 'Racha', 'Futebol de domingo', 1, 10, new Date('2026-11-29T10:00:00'), 3);

    service.saveOpenGame(7, 99, game).subscribe();

    const req = httpMock.expectOne(`${apiUrl}open-game/7/99`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(game);
    req.flush({});
  });

  it('participate should POST to the participar endpoint with a null body', () => {
    service.participate(7, 4, 12).subscribe();

    const req = httpMock.expectOne(`${apiUrl}open-game/participar/7/12/4`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush({});
  });

  it('desinscrever should DELETE the user from the game', () => {
    service.desinscrever(7, 12).subscribe();

    const req = httpMock.expectOne(`${apiUrl}open-game/desinscrever/7/12`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
