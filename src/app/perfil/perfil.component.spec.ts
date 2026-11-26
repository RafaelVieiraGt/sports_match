import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { PerfilComponent } from './perfil.component';
import { PerfilService } from '../../services/perfil.service';
import { PositionService } from '../../services/position.service';
import { User } from '../../model/User';
import { Position } from '../../model/Position';
import { CasualGame } from '../../model/CasualGame';
import { UserPhoto } from '../../model/UserPhoto';
import { EditPerfilDTO } from '../../model/EditPerfilDTO';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let perfilService: jasmine.SpyObj<PerfilService>;
  let positionService: jasmine.SpyObj<PositionService>;
  let router: jasmine.SpyObj<Router>;

  const user = new User(5, 'Rafael Vieira', 'Gosto de jogar de ala', '14999999999', 0, 1, 'Rua das Flores', 2, true);
  const positions = [new Position(1, 'Goleiro', '', 1), new Position(2, 'Ala', '', 1)];
  const nextGame = new CasualGame(9, 'Racha de domingo', 'Desc', 'Futebol', 'Quadra A', '10', -49, -22, 3, 1.5, 'url', 1, '29/11 10:00');

  const createComponent = () => {
    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
  };

  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('@userId', '5');
    localStorage.setItem('@userLatitude', '-22.3');
    localStorage.setItem('@userLongitude', '-49.06');

    perfilService = jasmine.createSpyObj<PerfilService>('PerfilService', ['getById', 'getNextGame', 'edit', 'getPhoto']);
    positionService = jasmine.createSpyObj<PositionService>('PositionService', ['findBySport']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));

    perfilService.getById.and.returnValue(of(user));
    perfilService.getNextGame.and.returnValue(of(nextGame));
    perfilService.getPhoto.and.returnValue(of(new UserPhoto('')));
    positionService.findBySport.and.returnValue(of(positions));

    await TestBed.configureTestingModule({
      imports: [PerfilComponent],
      providers: [
        { provide: PerfilService, useValue: perfilService },
        { provide: PositionService, useValue: positionService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    spyOn(console, 'log');
    spyOn(console, 'error');
  });

  afterEach(() => localStorage.clear());

  describe('rendering', () => {
    beforeEach(() => {
      createComponent();
      fixture.detectChanges();
    });

    it('should create reading ids and coordinates from localStorage', () => {
      expect(component).toBeTruthy();
      expect(component.userId).toBe(5);
      expect(component.latitude).toBe(-22.3);
      expect(component.longitude).toBe(-49.06);
    });

    it('should initialize the edit form', () => {
      expect(component.editProfile.value).toEqual({ nome: '', descricao: '', position: 0 });
    });

    it('should load the user, positions and the user favourite position', () => {
      expect(perfilService.getById).toHaveBeenCalledWith(5);
      expect(component.user).toEqual(user);
      expect(positionService.findBySport).toHaveBeenCalledWith(user.userFavPosition);
      expect(component.positions).toEqual(positions);
      expect(component.userPosition).toBe('Ala');
    });

    it('should load the next game and the user photo', () => {
      expect(perfilService.getNextGame).toHaveBeenCalledWith(5, -22.3, -49.06);
      expect(component.nextGame).toEqual(nextGame);
      expect(perfilService.getPhoto).toHaveBeenCalledWith(5);
      expect(component.userPhoto).toEqual(new UserPhoto(''));
    });

    it('should render the user data and next game card', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.dados-principais h1')?.textContent).toContain('Rafael Vieira');
      expect(el.querySelector('.dados-principais span')?.textContent).toContain('Rua das Flores');
      expect(el.querySelector('.preferencias')?.textContent).toContain('Ala');
      expect(el.querySelector('.next-game .card')?.textContent).toContain('Racha de domingo');
      expect(el.querySelector('.card-nogame')).toBeNull();
    });

    it('should render the default picture when the user has no photo', () => {
      const img = (fixture.nativeElement as HTMLElement).querySelector('.image img') as HTMLImageElement;
      expect(img.getAttribute('src')).toContain('perfil-vazio.png');
    });

    it('editarPerfil should toggle the edit modal', () => {
      component.editarPerfil();
      fixture.detectChanges();
      expect(component.editarPerfilModal).toBeTrue();
      expect((fixture.nativeElement as HTMLElement).querySelector('.editarPerfilModal')).not.toBeNull();

      component.editarPerfil();
      expect(component.editarPerfilModal).toBeFalse();
    });
  });

  it('should render the user photo when there is one', () => {
    perfilService.getPhoto.and.returnValue(of(new UserPhoto('QUJD')));
    createComponent();
    fixture.detectChanges();

    const img = (fixture.nativeElement as HTMLElement).querySelector('.image img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('data:image/png;base64,QUJD');
  });

  it('should render the "no game" card when there is no next game', () => {
    perfilService.getNextGame.and.returnValue(of(null as unknown as CasualGame));
    createComponent();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.card-nogame')?.textContent).toContain('Nenhum jogo disponível...');

    (el.querySelector('.marcarjogo-btn button') as HTMLButtonElement).click();
    expect(router.navigate).toHaveBeenCalledWith(['locations']);
  });

  describe('without rendering', () => {
    beforeEach(() => createComponent());

    it('should log when loading the user fails', () => {
      perfilService.getById.and.returnValue(throwError(() => 'erro usuário'));
      component.getUserById();
      expect(console.log).toHaveBeenCalledWith('erro usuário');
      expect(positionService.findBySport).not.toHaveBeenCalled();
    });

    it('should log when loading the positions fails', () => {
      positionService.findBySport.and.returnValue(throwError(() => 'erro posições'));
      component.getAllPositions(1);
      expect(console.log).toHaveBeenCalledWith('erro posições');
    });

    it('should log when loading the next game fails', () => {
      perfilService.getNextGame.and.returnValue(throwError(() => 'erro jogo'));
      component.findNextGame();
      expect(console.log).toHaveBeenCalledWith('erro jogo');
    });

    it('should log when loading the photo fails', () => {
      perfilService.getPhoto.and.returnValue(throwError(() => 'erro foto'));
      component.loadUserPhoto(5);
      expect(console.log).toHaveBeenCalledWith('erro foto');
    });

    it('loadNextGame should use the browser location when coordinates are null', () => {
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
        (success: PositionCallback) => success({ coords: { latitude: -10, longitude: -20 } } as GeolocationPosition)
      );
      component.latitude = null as unknown as number;
      component.longitude = null as unknown as number;

      component.loadNextGame();

      expect(component.latitude).toBe(-10);
      expect(component.longitude).toBe(-20);
      expect(perfilService.getNextGame).toHaveBeenCalledWith(5, -10, -20);
    });

    it('loadNextGame should log when the browser location fails', () => {
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
        (_s: PositionCallback, error?: PositionErrorCallback | null) => error?.({ code: 1 } as GeolocationPositionError)
      );
      component.latitude = null as unknown as number;
      component.longitude = null as unknown as number;

      component.loadNextGame();

      expect(console.error).toHaveBeenCalled();
      expect(perfilService.getNextGame).not.toHaveBeenCalled();
    });

    it('findUserPosition should keep userPosition undefined when there is no match', () => {
      component.positions = positions;
      component.findUserPosition(999);
      expect(component.userPosition).toBeUndefined();
    });

    it('onFileSelected should store the file name and its base64 content', () => {
      const fakeReader: any = {
        result: null,
        onload: null,
        readAsDataURL(): void {
          fakeReader.result = 'data:image/png;base64,QUJD';
          fakeReader.onload?.();
        }
      };
      spyOn(window as any, 'FileReader').and.returnValue(fakeReader);
      const file = new File(['ABC'], 'foto.png', { type: 'image/png' });

      component.onFileSelected({ target: { files: [file] } } as unknown as Event);

      expect(component.selectedFileName).toBe('foto.png');
      expect(component.fileBase64).toBe('data:image/png;base64,QUJD');
    });

    it('onFileSelected should do nothing when no file was chosen', () => {
      component.onFileSelected({ target: { files: [] } } as unknown as Event);
      expect(component.selectedFileName).toBeUndefined();
    });

    it('navigate should call the router with the route', () => {
      component.navigate('/game-hub');
      expect(router.navigate).toHaveBeenCalledWith(['/game-hub']);
    });

    describe('edit', () => {
      beforeEach(() => {
        component.ngOnInit();
        component.fileBase64 = 'data:image/png;base64,QUJD';
        component.editarPerfilModal = true;
      });

      it('should send the DTO, close the modal and show a success alert', () => {
        const fire = spyOn(Swal, 'fire');
        perfilService.edit.and.returnValue(of({}));
        component.editProfile.setValue({ nome: 'Novo Nome', descricao: 'Nova descrição', position: '2' });

        component.edit();

        expect(perfilService.edit).toHaveBeenCalledWith(5,
          new EditPerfilDTO('Novo Nome', 'Nova descrição', 'QUJD', '2' as unknown as number));
        expect(component.editarPerfilModal).toBeFalse();
        expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success' }));
      });

      it('should send null for fields left blank', () => {
        perfilService.edit.and.returnValue(of({}));
        spyOn(Swal, 'fire');

        component.edit();

        const dto = perfilService.edit.calls.mostRecent().args[1];
        expect(dto.nome).toBeNull();
        expect(dto.descricao).toBeNull();
        expect(dto.position).toBeNull();
        expect(dto.foto).toBe('QUJD');
      });

      it('should log when the update fails and keep the modal open', () => {
        perfilService.edit.and.returnValue(throwError(() => 'erro edição'));

        component.edit();

        expect(console.log).toHaveBeenCalledWith('erro edição');
        expect(component.editarPerfilModal).toBeTrue();
      });
    });
  });
});
