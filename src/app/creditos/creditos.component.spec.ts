import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { CreditosComponent } from './creditos.component';

describe('CreditosComponent', () => {
  let component: CreditosComponent;
  let fixture: ComponentFixture<CreditosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditosComponent],
      providers: [{ provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) }]
    }).compileComponents();

    fixture = TestBed.createComponent(CreditosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header, footer and both sections', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-header')).not.toBeNull();
    expect(el.querySelector('app-footer')).not.toBeNull();

    const titles = Array.from(el.querySelectorAll('h2')).map(h => h.textContent?.trim());
    expect(titles).toEqual(['SUPORTE', 'CRIADORES']);
  });

  it('should list the five creators', () => {
    const creators = (fixture.nativeElement as HTMLElement).querySelectorAll('.criadores p');
    expect(creators.length).toBe(5);
  });
});
