import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationComponent } from './location.component';
import Swal from 'sweetalert2';

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a toast when game fields are incomplete', () => {
    spyOn(Swal, 'fire');

    component.cadastrarJogo();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      toast: true,
      icon: 'warning',
      title: 'Preencha todos os campos do jogo.'
    }));
  });

  it('should show a toast when max players is not greater than one', () => {
    spyOn(Swal, 'fire');
    component.gameForm.setValue({
      title: 'Partida',
      description: 'Descrição',
      sport: 1,
      day: '2026-11-23T20:00',
      maxPlayers: 1
    });

    component.cadastrarJogo();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      toast: true,
      icon: 'warning',
      title: 'O número máximo de jogadores deve ser maior que 1.'
    }));
  });
});
