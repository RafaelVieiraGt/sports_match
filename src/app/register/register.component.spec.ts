import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { RegisterComponent } from './register.component';
import { UserServiceService } from '../../services/user-service.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: jasmine.SpyObj<UserServiceService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userService = jasmine.createSpyObj<UserServiceService>('UserServiceService', ['loginUser']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: UserServiceService, useValue: userService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create with an empty login form', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm.value).toEqual({ email: '', senha: '' });
    expect(component.viewPasswd).toBeFalse();
  });

  it('viewPassword should toggle the password input type', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('input[formControlName="senha"]')?.getAttribute('type')).toBe('password');

    component.viewPassword();
    fixture.detectChanges();
    expect(component.viewPasswd).toBeTrue();
    expect(el.querySelector('input[formControlName="senha"]')?.getAttribute('type')).toBe('text');

    component.viewPassword();
    expect(component.viewPasswd).toBeFalse();
  });

  it('login should warn and not call the service when fields are empty', () => {
    const fire = spyOn(Swal, 'fire');

    component.login();

    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Atenção!',
      text: 'Campos Obrigatórios devem ser preenchidos!'
    }));
    expect(userService.loginUser).not.toHaveBeenCalled();
  });

  it('login should warn when only the password is empty', () => {
    const fire = spyOn(Swal, 'fire');
    component.loginForm.setValue({ email: 'a@b.com', senha: '' });

    component.login();

    expect(fire).toHaveBeenCalled();
    expect(userService.loginUser).not.toHaveBeenCalled();
  });

  it('login should store the user id and go to /game-hub on success', () => {
    userService.loginUser.and.returnValue(of(7));
    component.loginForm.setValue({ email: 'a@b.com', senha: '123456' });

    component.login();

    expect(userService.loginUser).toHaveBeenCalledWith('a@b.com', '123456');
    expect(localStorage.getItem('@userId')).toBe('7');
    expect(router.navigate).toHaveBeenCalledWith(['/game-hub']);
  });

  it('login should show an alert when the service errors', () => {
    const fire = spyOn(Swal, 'fire');
    userService.loginUser.and.returnValue(throwError(() => new Error('401')));
    component.loginForm.setValue({ email: 'a@b.com', senha: 'errada' });

    component.login();

    expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({ title: 'Usuário não encontrado!' }));
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('navigate should call the router with the route', () => {
    component.navigate('/login');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('"Voltar" button should navigate to /home', () => {
    (fixture.nativeElement.querySelector('.btn-voltar') as HTMLButtonElement).click();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});
