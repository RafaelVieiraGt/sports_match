import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { GameHubComponent } from './game-hub.component';
import { GameHubServiceService } from '../../services/game-hub-service.service';
import { PositionService } from '../../services/position.service';
import { CasualGame } from '../../model/CasualGame';
import { Position } from '../../model/Position';

describe('GameHubComponent', () => {
  let component: GameHubComponent;
  let fixture: ComponentFixture<GameHubComponent>;
  let gameService: jasmine.SpyObj<GameHubServiceService>;
  let positionService: jasmine.SpyObj<PositionService>;
  let geoSpy: jasmine.Spy<Geolocation['getCurrentPosition']>;

  const games = [
    new CasualGame(1, 'Racha de futebol', 'Desc', 'Futebol', 'Quadra A', '10', -49, -22, 3, 1.234, 'url1', 1, '29/11 10:00'),
    new CasualGame(2, 'Basquete 3x3', 'Desc', 'Basquete', 'Quadra B', '6', -49, -22, 2, 2.5, 'url2', 2, '30/11 18:00')
  ];
  const positions = [
    new Position(1, 'Goleiro', '', 1),
    new Position(2, 'Pivô', '', 2),
    new Position(3, 'Levantador', '', 3)
  ];

  const geoError = (code: number) =>
    ({ code, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError);

  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('@userId', '7');

    gameService = jasmine.createSpyObj<GameHubServiceService>('GameHubServiceService',
      ['getAllGames', 'participate', 'desinscrever']);
    positionService = jasmine.createSpyObj<PositionService>('PositionService', ['getAll']);
    gameService.getAllGames.and.returnValue(of(games));
    positionService.getAll.and.returnValue(of(positions));

    geoSpy = spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
      (success: PositionCallback) => success({ coords: { latitude: -22.3, longitude: -49.06 } } as GeolocationPosition)
    );

    await TestBed.configureTestingModule({
      imports: [GameHubComponent],
      providers: [
        { provide: GameHubServiceService, useValue: gameService },
        { provide: PositionService, useValue: positionService },
        { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) }
      ]
    }).compileComponents();

    spyOn(console, 'log');
    spyOn(console, 'error');
    fixture = TestBed.createComponent(GameHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create with the default position "99"', () => {
    expect(component).toBeTruthy();
    expect(component.selectForm.get('position')?.value).toBe('99');
  });

  it('should store the user location and load nearby games', () => {
    expect(component.latitude).toBe(-22.3);
    expect(component.longitude).toBe(-49.06);
    expect(localStorage.getItem('@userLatitude')).toBe('-22.3');
    expect(localStorage.getItem('@userLongitude')).toBe('-49.06');
    expect(gameService.getAllGames).toHaveBeenCalledWith(-22.3, -49.06);
    expect(component.data).toEqual(games);
  });

  it('should load positions and split them by sport', () => {
    expect(component.positions).toEqual(positions);
    expect(component.futPositions.map(p => p.positionId)).toEqual([1]);
    expect(component.baskPositions.map(p => p.positionId)).toEqual([2]);
    expect(component.voleiPositions.map(p => p.positionId)).toEqual([3]);
  });

  it('should render one card per game', () => {
    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('.card');
    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toContain('Racha de futebol');
    expect(cards[0].textContent).toContain('Quadra A - 1.23km');
    expect(cards[0].querySelector('select')?.textContent).toContain('Goleiro');
    expect(cards[1].querySelector('select')?.textContent).toContain('Pivô');
  });

  it('should set an error message when the geolocation fails', () => {
    geoSpy.and.callFake((_s: PositionCallback, error?: PositionErrorCallback | null) => error?.(geoError(1)));

    component.getGamesByUserLocation();

    expect(component.errorMessage).toBe('Permissão negada para acessar a localização.');
    expect(console.error).toHaveBeenCalled();
  });

  it('should set an error message when geolocation is not supported', () => {
    spyOnProperty(navigator, 'geolocation', 'get').and.returnValue(undefined as unknown as Geolocation);

    component.getGamesByUserLocation();

    expect(component.errorMessage).toBe('Geolocalização não é suportada pelo seu navegador.');
  });

  it('getGeolocationErrorMessage should map every error code', () => {
    expect(component.getGeolocationErrorMessage(geoError(1))).toBe('Permissão negada para acessar a localização.');
    expect(component.getGeolocationErrorMessage(geoError(2))).toBe('Informação de localização não está disponível.');
    expect(component.getGeolocationErrorMessage(geoError(3))).toBe('A solicitação para obter a localização expirou.');
    expect(component.getGeolocationErrorMessage(geoError(99))).toBe('Ocorreu um erro desconhecido ao acessar a localização.');
  });

  it('should log when loading games fails', () => {
    gameService.getAllGames.and.returnValue(throwError(() => 'erro jogos'));

    component.loadGames();

    expect(console.error).toHaveBeenCalledWith('Erro ao buscar dados da API', 'erro jogos');
  });

  it('should log when loading positions fails', () => {
    positionService.getAll.and.returnValue(throwError(() => 'falhou'));

    component.loadPositions();

    expect(console.log).toHaveBeenCalledWith('Error: falhou');
  });

  it('participar should join the game with the selected position', () => {
    const fire = spyOn(Swal, 'fire');
    gameService.participate.and.returnValue(of({}));
    component.selectForm.setValue({ position: '1' });

    component.participar(1);

    expect(gameService.participate).toHaveBeenCalledWith(7, '1' as unknown as number, 1);
    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'success',
      text: 'Agora você está participando desse jogo!'
    }));
  });

  it('participar should show the API error message', () => {
    const fire = spyOn(Swal, 'fire');
    gameService.participate.and.returnValue(throwError(() => ({ error: { message: 'Jogo lotado' } })));

    component.participar(1);

    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'info', text: 'Jogo lotado' }));
  });

  it('desinscrever should leave the game', () => {
    const fire = spyOn(Swal, 'fire');
    gameService.desinscrever.and.returnValue(of({}));

    component.desinscrever(2);

    expect(gameService.desinscrever).toHaveBeenCalledWith(7, 2);
    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'success',
      text: 'Você não participa mais desse jogo!'
    }));
  });

  it('desinscrever should show the API error message', () => {
    const fire = spyOn(Swal, 'fire');
    gameService.desinscrever.and.returnValue(throwError(() => ({ error: { message: 'Você não está inscrito' } })));

    component.desinscrever(2);

    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'info', text: 'Você não está inscrito' }));
  });

  it('the card buttons should call participar and desinscrever', () => {
    spyOn(component, 'participar');
    spyOn(component, 'desinscrever');
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('.card .btnareagamehub button');

    (buttons[0] as HTMLButtonElement).click();
    (buttons[1] as HTMLButtonElement).click();

    expect(component.participar).toHaveBeenCalledWith(1);
    expect(component.desinscrever).toHaveBeenCalledWith(1);
  });
});
