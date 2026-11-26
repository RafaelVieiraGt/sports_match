import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthGuard } from './auth.guard';
import { PerfilService } from '../services/perfil.service';
import { User } from '../model/User';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let perfilService: jasmine.SpyObj<PerfilService>;
  let router: jasmine.SpyObj<Router>;

  const buildUser = (active: boolean) =>
    new User(42, 'Rafael', 'Ala', '14999999999', 0, 1, 'Rua A', 2, active);

  beforeEach(() => {
    perfilService = jasmine.createSpyObj<PerfilService>('PerfilService', ['getById']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      providers: [
        { provide: PerfilService, useValue: perfilService },
        { provide: Router, useValue: router }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    localStorage.setItem('@userId', '42');
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow navigation when the user is active', () => {
    perfilService.getById.and.returnValue(of(buildUser(true)));
    let result: boolean | undefined;

    guard.canActivate().subscribe(value => (result = value));

    expect(perfilService.getById).toHaveBeenCalledWith(42);
    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should block navigation and redirect to /home when the user is inactive', () => {
    perfilService.getById.and.returnValue(of(buildUser(false)));
    let result: boolean | undefined;

    guard.canActivate().subscribe(value => (result = value));

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should block navigation and redirect to /home when the request fails', () => {
    spyOn(console, 'error');
    perfilService.getById.and.returnValue(throwError(() => new Error('500')));
    let result: boolean | undefined;

    guard.canActivate().subscribe(value => (result = value));

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    expect(console.error).toHaveBeenCalled();
  });

  it('should use 0 as user id when nothing is stored', () => {
    localStorage.removeItem('@userId');
    perfilService.getById.and.returnValue(of(buildUser(true)));

    guard.canActivate().subscribe();

    expect(perfilService.getById).toHaveBeenCalledWith(0);
  });
});
