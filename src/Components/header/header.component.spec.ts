import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: jasmine.SpyObj<Router>;

  const buttons = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('button'));
  const button = (label: string): HTMLButtonElement =>
    buttons().find(b => b.textContent?.trim() === label)!;

  beforeEach(async () => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: Router, useValue: router }]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.isLanding).toBeFalse();
  });

  it('should show navigation buttons and hide login when not on landing page', () => {
    expect(button('Jogos').classList).toContain('button-home');
    expect(button('Fazer Login').classList).toContain('btn-hidden');
  });

  it('should hide navigation buttons and show login on landing page', () => {
    fixture.componentRef.setInput('isLanding', true);
    fixture.detectChanges();

    expect(button('Jogos').classList).toContain('btn-hidden');
    expect(button('Sair').classList).toContain('btn-hidden');
    expect(button('Fazer Login').classList).toContain('button-login');
  });

  it('navigate should call the router with the route', () => {
    component.navigate('/profile');
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('each button should navigate to its route', () => {
    const expected: Record<string, string> = {
      'Jogos': '/game-hub',
      'Novo Jogo': '/locations',
      'Perfil': '/profile',
      'Créditos': '/creditos',
      'Fazer Login': '/register'
    };

    for (const label of Object.keys(expected)) {
      button(label).click();
      expect(router.navigate).toHaveBeenCalledWith([expected[label]]);
    }
  });

  it('quit should clear localStorage and go to /home', () => {
    localStorage.setItem('@userId', '1');

    button('Sair').click();

    expect(localStorage.getItem('@userId')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});
