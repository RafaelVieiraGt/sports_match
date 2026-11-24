import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: Router, useValue: router }]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header in landing mode and the footer', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-header')).not.toBeNull();
    expect(el.querySelector('app-footer')).not.toBeNull();

    const loginButton = Array.from(el.querySelectorAll('app-header button'))
      .find(b => b.textContent?.trim() === 'Fazer Login');
    expect(loginButton?.classList).toContain('button-login');
  });

  it('navigate should call the router with the route', () => {
    component.navigate('/register');
    expect(router.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('"Cadastre-se" button should navigate to login', () => {
    const button = (fixture.nativeElement as HTMLElement).querySelector('.parte-baixo button') as HTMLButtonElement;
    button.click();
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });
});
