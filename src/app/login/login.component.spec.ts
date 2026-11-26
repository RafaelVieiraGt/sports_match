import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { LoginComponent } from './login.component';
import { SportsService } from '../../services/sports.service';
import { PositionService } from '../../services/position.service';
import { AddressService } from '../../services/address.service';
import { UserServiceService } from '../../services/user-service.service';
import { Sports } from '../../model/Sports';
import { Position } from '../../model/Position';
import { Cep } from '../../model/Cep';
import { User } from '../../model/User';
import { UserDTO } from '../../model/UserDTO';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let sportsService: jasmine.SpyObj<SportsService>;
  let positionService: jasmine.SpyObj<PositionService>;
  let addressService: jasmine.SpyObj<AddressService>;
  let userService: jasmine.SpyObj<UserServiceService>;
  let router: jasmine.SpyObj<Router>;

  const sports = [new Sports(1, 'Futebol', ''), new Sports(2, 'Basquete', ''), new Sports(3, 'Vôlei', '')];
  const positions = [
    new Position(1, 'Goleiro', '', 1),
    new Position(2, 'Atacante', '', 1),
    new Position(3, 'Pivô', '', 2),
    new Position(4, 'Levantador', '', 3),
    new Position(5, 'Outro', '', 9)
  ];
  const cep = new Cep('17012-000', 'Rua A', 'Bauru', 'SP');
  const user = new User(7, 'Rafael', '', '', 0, 15, 'Rua A', 2, true);

  const fillForm = (overrides: Partial<Record<string, string>> = {}) =>
    component.registerForm.setValue({
      name: 'Rafael',
      email: 'r@x.com',
      senha: '123456',
      sport: '1',
      position: '2',
      cep: '17012-000',
      ...overrides
    });

  beforeEach(async () => {
    sportsService = jasmine.createSpyObj<SportsService>('SportsService', ['getAllSports']);
    positionService = jasmine.createSpyObj<PositionService>('PositionService', ['getAll']);
    addressService = jasmine.createSpyObj<AddressService>('AddressService', ['loadCep', 'createAddress']);
    userService = jasmine.createSpyObj<UserServiceService>('UserServiceService', ['createUser']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));

    sportsService.getAllSports.and.returnValue(of(sports));
    positionService.getAll.and.returnValue(of(positions));

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: SportsService, useValue: sportsService },
        { provide: PositionService, useValue: positionService },
        { provide: AddressService, useValue: addressService },
        { provide: UserServiceService, useValue: userService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    spyOn(console, 'log');
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create with an empty register form', () => {
    expect(component).toBeTruthy();
    expect(component.registerForm.value).toEqual({
      name: '', email: '', senha: '', sport: '', position: '', cep: ''
    });
  });

  it('should load sports on init', () => {
    expect(sportsService.getAllSports).toHaveBeenCalled();
    expect(component.sports).toEqual(sports);
  });

  it('should load positions on init and split them by sport', () => {
    expect(component.positions).toEqual(positions);
    expect(component.futPositions.map(p => p.positionId)).toEqual([1, 2]);
    expect(component.baskPositions.map(p => p.positionId)).toEqual([3]);
    expect(component.voleiPositions.map(p => p.positionId)).toEqual([4]);
  });

  it('should log errors when loading sports or positions fails', () => {
    sportsService.getAllSports.and.returnValue(throwError(() => 'erro esportes'));
    positionService.getAll.and.returnValue(throwError(() => 'erro posições'));

    component.loadSports();
    component.loadPositions();

    expect(console.log).toHaveBeenCalledWith('erro esportes');
    expect(console.log).toHaveBeenCalledWith('erro posições');
  });

  it('should show the position select for the chosen sport', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('select').length).toBe(1);

    component.registerForm.get('sport')?.setValue('2');
    fixture.detectChanges();

    const selects = el.querySelectorAll('select');
    expect(selects.length).toBe(2);
    expect(selects[1].querySelectorAll('option').length).toBe(1);
    expect(selects[1].textContent).toContain('Pivô');
  });

  it('handleChange should log the selected sport', () => {
    component.registerForm.get('sport')?.setValue('3');
    component.handleChange();
    expect(console.log).toHaveBeenCalledWith('3');
  });

  it('viewPassword should toggle the password visibility', () => {
    component.viewPassword();
    expect(component.viewPasswd).toBeTrue();
    component.viewPassword();
    expect(component.viewPasswd).toBeFalse();
  });

  it('confirmCep should warn when required fields are empty', () => {
    const fire = spyOn(Swal, 'fire');
    addressService.loadCep.and.returnValue(throwError(() => 'cep inválido'));

    component.confirmCep();

    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({
      text: 'Campos Obrigatórios devem ser preenchidos!'
    }));
    expect(component.modalActive).toBeFalse();
  });

  it('confirmCep should load the CEP (digits only) and open the modal', () => {
    const fire = spyOn(Swal, 'fire');
    addressService.loadCep.and.returnValue(of(cep));
    fillForm();

    component.confirmCep();
    fixture.detectChanges();

    expect(fire).not.toHaveBeenCalled();
    expect(addressService.loadCep).toHaveBeenCalledWith(17012000);
    expect(component.cep).toEqual(cep);
    expect(component.modalActive).toBeTrue();

    const modal = (fixture.nativeElement as HTMLElement).querySelector('.modal-confirmar-cep');
    expect(modal?.textContent).toContain('Bauru');
    expect(modal?.textContent).toContain('Rua A');
  });

  it('confirmCep should keep the modal closed when loading the CEP fails', () => {
    addressService.loadCep.and.returnValue(throwError(() => 'erro cep'));
    fillForm();

    component.confirmCep();

    expect(component.modalActive).toBeFalse();
    expect(console.log).toHaveBeenCalledWith('erro cep');
  });

  it('closeModal should close the modal', () => {
    component.modalActive = true;
    component.closeModal();
    expect(component.modalActive).toBeFalse();
  });

  it('register should create the address and then the user', () => {
    addressService.createAddress.and.returnValue(of(15));
    userService.createUser.and.returnValue(of(user));
    fillForm();

    component.register();

    expect(addressService.createAddress).toHaveBeenCalledWith(17012000);
    expect(userService.createUser).toHaveBeenCalledWith(
      new UserDTO('Rafael', 'r@x.com', '123456', '1' as unknown as number, '2' as unknown as number, '15')
    );
    expect(localStorage.getItem('@userId')).toBe('7');
    expect(router.navigate).toHaveBeenCalledWith(['/game-hub']);
  });

  it('register should send null for empty optional fields', () => {
    addressService.createAddress.and.returnValue(of(15));
    userService.createUser.and.returnValue(of(user));
    fillForm({ sport: '', position: '' });

    component.register();

    const dto = userService.createUser.calls.mostRecent().args[0];
    expect(dto.sport).toBeNull();
    expect(dto.position).toBeNull();
    expect(dto.cep).toBe('15');
  });

  it('register should alert when creating the address fails', () => {
    const fire = spyOn(Swal, 'fire');
    addressService.createAddress.and.returnValue(throwError(() => 'erro'));
    fillForm();

    component.register();

    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({ text: 'Email já está em uso!' }));
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  it('registerUser should close the modal and alert when creating the user fails', () => {
    const fire = spyOn(Swal, 'fire');
    userService.createUser.and.returnValue(throwError(() => 'erro'));
    component.modalActive = true;

    component.registerUser(new UserDTO('Rafael', 'r@x.com', '123', 1, 2, '15'));

    expect(component.modalActive).toBeFalse();
    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({ text: 'Email já está em uso!' }));
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('navigate should call the router with the route', () => {
    component.navigate('/register');
    expect(router.navigate).toHaveBeenCalledWith(['/register']);
  });
});
