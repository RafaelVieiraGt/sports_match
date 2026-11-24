import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { LocationComponent } from './location.component';
import { MapComponent } from '../../Components/map/map.component';
import { LocationService } from '../../services/location.service';
import { GameHubServiceService } from '../../services/game-hub-service.service';
import { SportsService } from '../../services/sports.service';
import { Place } from '../../model/Place';
import { Sports } from '../../model/Sports';

@Component({ selector: 'app-map', standalone: true, template: '' })
class MapStubComponent {}

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;
  let locationService: jasmine.SpyObj<LocationService>;
  let gameService: jasmine.SpyObj<GameHubServiceService>;
  let sportsService: jasmine.SpyObj<SportsService>;
  let geoSpy: jasmine.Spy<Geolocation['getCurrentPosition']>;

  const places = [new Place(10, 'Quadra A', 'Coberta', -49.06, -22.31)];
  const sports = [new Sports(1, 'Futebol', '')];
  const validGame = {
    title: 'Partida',
    description: 'Descrição',
    sport: 1,
    day: '2026-11-23T20:00',
    maxPlayers: 10
  };

  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('@userId', '7');

    locationService = jasmine.createSpyObj<LocationService>('LocationService', ['getAllLocations', 'saveLocation']);
    gameService = jasmine.createSpyObj<GameHubServiceService>('GameHubServiceService', ['saveOpenGame']);
    sportsService = jasmine.createSpyObj<SportsService>('SportsService', ['getAllSports']);
    locationService.getAllLocations.and.returnValue(of(places));
    sportsService.getAllSports.and.returnValue(of(sports));

    geoSpy = spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
      (success: PositionCallback) => success({ coords: { latitude: -22.3, longitude: -49.06 } } as GeolocationPosition)
    );

    await TestBed.configureTestingModule({
      imports: [LocationComponent],
      providers: [
        { provide: LocationService, useValue: locationService },
        { provide: GameHubServiceService, useValue: gameService },
        { provide: SportsService, useValue: sportsService },
        { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) }
      ]
    })
      .overrideComponent(LocationComponent, {
        remove: { imports: [MapComponent] },
        add: { imports: [MapStubComponent] }
      })
      .compileComponents();

    spyOn(console, 'log');
    spyOn(console, 'error');
    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.userId).toBe(7);
  });

  it('should initialize the forms on init', () => {
    expect(component.gameForm.value).toEqual({ title: '', description: '', sport: '', day: '', maxPlayers: '' });
    expect(component.placeForm.value).toEqual({ name: '', description: '' });
    expect(component.selectQuadra.value).toEqual({ quadra: null });
  });

  it('should load sports and nearby places using the user location', () => {
    expect(component.sports).toEqual(sports);
    expect(component.userLat).toBe(-22.3);
    expect(component.userLng).toBe(-49.06);
    expect(locationService.getAllLocations).toHaveBeenCalledWith(-22.3, -49.06);
    expect(component.places).toEqual(places);
  });

  it('should log when the geolocation fails', () => {
    geoSpy.and.callFake((_s: PositionCallback, error?: PositionErrorCallback | null) =>
      error?.({ code: 1 } as GeolocationPositionError)
    );

    component.getUserData();

    expect(console.error).toHaveBeenCalled();
  });

  it('should log when loading places or sports fails', () => {
    locationService.getAllLocations.and.returnValue(throwError(() => 'erro locais'));
    sportsService.getAllSports.and.returnValue(throwError(() => 'erro esportes'));

    component.getQuadrasExistentes();
    component.getAllSports();

    expect(console.log).toHaveBeenCalledWith('erro locais');
    expect(console.log).toHaveBeenCalledWith('erro esportes');
  });

  it('should show a toast when game fields are incomplete', () => {
    const fire = spyOn(Swal, 'fire');

    component.cadastrarJogo();

    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({
      toast: true,
      icon: 'warning',
      title: 'Preencha todos os campos do jogo.'
    }));
    expect(gameService.saveOpenGame).not.toHaveBeenCalled();
  });

  it('should treat whitespace-only fields as empty', () => {
    const fire = spyOn(Swal, 'fire');
    component.gameForm.setValue({ ...validGame, title: '   ' });

    component.cadastrarJogo();

    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({ title: 'Preencha todos os campos do jogo.' }));
  });

  it('should treat null fields as empty', () => {
    const fire = spyOn(Swal, 'fire');
    component.gameForm.setValue({ ...validGame, sport: null });

    component.cadastrarJogo();

    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({ title: 'Preencha todos os campos do jogo.' }));
  });

  it('should show a toast when max players is not greater than one', () => {
    const fire = spyOn(Swal, 'fire');
    component.gameForm.setValue({ ...validGame, maxPlayers: 1 });

    component.cadastrarJogo();

    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({
      toast: true,
      icon: 'warning',
      title: 'O número máximo de jogadores deve ser maior que 1.'
    }));
  });

  it('should show a toast when max players is not a number', () => {
    const fire = spyOn(Swal, 'fire');
    component.gameForm.setValue({ ...validGame, maxPlayers: 'abc' });

    component.cadastrarJogo();

    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'O número máximo de jogadores deve ser maior que 1.'
    }));
  });

  it('should open the new place modal when a point was picked on the map', () => {
    localStorage.setItem('@latitude', '-22.1');
    localStorage.setItem('@longitude', '-49.2');
    component.gameForm.setValue(validGame);

    component.cadastrarJogo();
    fixture.detectChanges();

    expect(component.modalActive).toBeTrue();
    expect(gameService.saveOpenGame).not.toHaveBeenCalled();
    expect((fixture.nativeElement as HTMLElement).querySelector('.modal')).not.toBeNull();
  });

  it('should save the game on an existing place', () => {
    const fire = spyOn(Swal, 'fire');
    gameService.saveOpenGame.and.returnValue(of({}));
    component.gameForm.setValue(validGame);
    component.selectQuadra.setValue({ quadra: places[0] });
    component.modalActive = true;

    component.cadastrarJogo();

    expect(gameService.saveOpenGame).toHaveBeenCalledWith(7, 99, jasmine.objectContaining({
      opengameTitle: 'Partida',
      opengameDesc: 'Descrição',
      sport: 1,
      maxPlayers: 10,
      opengameDay: '2026-11-23T20:00' as unknown as Date,
      opengameLocation: 10
    }));
    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success', text: 'Jogo Criado com sucesso!' }));
    expect(component.modalActive).toBeFalse();
  });

  it('should log when saving the game on an existing place fails', () => {
    gameService.saveOpenGame.and.returnValue(throwError(() => 'erro jogo'));
    component.gameForm.setValue(validGame);
    component.selectQuadra.setValue({ quadra: places[0] });

    component.cadastrarJogo();

    expect(console.log).toHaveBeenCalledWith('erro jogo');
  });

  it('quadraExists should clear the coordinates picked on the map', () => {
    localStorage.setItem('@latitude', '-22.1');
    localStorage.setItem('@longitude', '-49.2');

    component.quadraExists();

    expect(localStorage.getItem('@latitude')).toBeNull();
    expect(localStorage.getItem('@longitude')).toBeNull();
  });

  it('cadastrarQuadraJogo should show a toast when place fields are incomplete', () => {
    const fire = spyOn(Swal, 'fire');

    component.cadastrarQuadraJogo();

    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({ title: 'Preencha todos os campos da quadra.' }));
    expect(locationService.saveLocation).not.toHaveBeenCalled();
  });

  it('cadastrarQuadraJogo should save the place and then the game on it', () => {
    const fire = spyOn(Swal, 'fire');
    localStorage.setItem('@latitude', '-22.1');
    localStorage.setItem('@longitude', '-49.2');
    locationService.saveLocation.and.returnValue(of(new Place(55, 'Nova', 'Desc', -49.2, -22.1)));
    gameService.saveOpenGame.and.returnValue(of({}));
    component.gameForm.setValue(validGame);
    component.placeForm.setValue({ name: 'Nova', description: 'Desc' });
    component.modalActive = true;

    component.cadastrarQuadraJogo();

    expect(locationService.saveLocation).toHaveBeenCalledWith(jasmine.objectContaining({
      placeName: 'Nova',
      placeDesc: 'Desc',
      placeLatitude: -22.1,
      placeLongitude: -49.2
    }));
    expect(component.newPlaceId).toBe(55);
    expect(gameService.saveOpenGame).toHaveBeenCalledWith(7, 99, jasmine.objectContaining({ opengameLocation: 55 }));
    expect(component.modalActive).toBeFalse();
    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({ text: 'Jogo cadastrado  na Quadra: 55' }));
  });

  it('cadastrarQuadraJogo should not save the game when saving the place fails', () => {
    locationService.saveLocation.and.returnValue(throwError(() => 'erro quadra'));
    component.placeForm.setValue({ name: 'Nova', description: 'Desc' });

    component.cadastrarQuadraJogo();

    expect(console.log).toHaveBeenCalledWith('erro quadra');
    expect(gameService.saveOpenGame).not.toHaveBeenCalled();
  });

  it('cadastrarQuadraJogo should log when saving the game fails', () => {
    locationService.saveLocation.and.returnValue(of(new Place(55, 'Nova', 'Desc', 0, 0)));
    gameService.saveOpenGame.and.returnValue(throwError(() => 'erro jogo'));
    component.gameForm.setValue(validGame);
    component.placeForm.setValue({ name: 'Nova', description: 'Desc' });

    component.cadastrarQuadraJogo();

    expect(console.log).toHaveBeenCalledWith('erro jogo');
  });

  it('sairModal should close the modal', () => {
    component.modalActive = true;
    component.sairModal();
    expect(component.modalActive).toBeFalse();
  });
});
