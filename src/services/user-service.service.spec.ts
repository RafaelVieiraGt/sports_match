import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Auth } from '@angular/fire/auth';

import { UserServiceService } from './user-service.service';

/*
 * createUser e loginUser chamam funções modulares do Firebase
 * (createUserWithEmailAndPassword / signInWithEmailAndPassword) importadas
 * diretamente, que não podem ser substituídas por spies em ES modules.
 * Para testá-las de forma unitária, o ideal é encapsular essas chamadas em
 * um serviço injetável próprio (ex.: FirebaseAuthService) e mocká-lo aqui.
 */
describe('UserServiceService', () => {
  let service: UserServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Auth, useValue: {} }
      ]
    });
    service = TestBed.inject(UserServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUser should throw because it is not implemented', () => {
    expect(() => service.getUser()).toThrowError('Method not implemented.');
  });
});
