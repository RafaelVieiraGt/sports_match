import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import * as L from 'leaflet';

import { MapComponent } from './map.component';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const getMap = (): L.Map | undefined => (component as any).map;
  const getMarker = (): L.Marker | undefined => (component as any).marker;

  const setup = async (platformId: string) => {
    await TestBed.configureTestingModule({
      imports: [MapComponent],
      providers: [{ provide: PLATFORM_ID, useValue: platformId }]
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  afterEach(() => {
    getMap()?.remove();
    localStorage.clear();
  });

  describe('in the browser', () => {
    beforeEach(async () => {
      await setup('browser');
      await wait(150);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the Leaflet map after the view init', () => {
      const map = getMap();
      expect(map).toBeDefined();
      expect(map!.getZoom()).toBe(12);
      expect(map!.getCenter().lat).toBeCloseTo(-22.3154, 4);
      expect(map!.getCenter().lng).toBeCloseTo(-49.0615, 4);

      const container = fixture.nativeElement.querySelector('#map') as HTMLElement;
      expect(container.classList).toContain('leaflet-container');
    });

    it('should add the marker at the default position', () => {
      const marker = getMarker();
      expect(marker).toBeDefined();
      expect(marker!.getLatLng().lat).toBeCloseTo(-22.4994, 4);
      expect(marker!.getLatLng().lng).toBeCloseTo(-48.5523, 4);
    });

    it('should move the marker and store the coordinates when the map is clicked', () => {
      getMap()!.fire('click', { latlng: L.latLng(-22.1, -49.2) });

      expect(getMarker()!.getLatLng().lat).toBeCloseTo(-22.1, 4);
      expect(getMarker()!.getLatLng().lng).toBeCloseTo(-49.2, 4);
      expect(localStorage.getItem('@latitude')).toBe('-22.1');
      expect(localStorage.getItem('@longitude')).toBe('-49.2');
    });
  });

  describe('on the server', () => {
    beforeEach(async () => {
      await setup('server');
      await wait(150);
    });

    it('should not initialize the map', () => {
      expect(getMap()).toBeUndefined();
    });
  });
});
