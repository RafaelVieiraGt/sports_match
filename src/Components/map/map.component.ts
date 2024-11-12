import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, AfterViewInit, PLATFORM_ID, Renderer2, ElementRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private marker:any;

  private customIcon = L.icon({
    iconUrl: 'Assets/icon-map.png', 
    iconSize: [38, 38], 
    iconAnchor: [19, 38], 
    popupAnchor: [0, -38] 
  });

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  private initMap(): void {
    const mapContainer = this.el.nativeElement.querySelector('#map');
    
    if (mapContainer) {
      this.map = L.map(mapContainer, {
        center: [ -22.3154, -49.0615 ],
        zoom: 12
      });
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
      });
      tiles.addTo(this.map);

      this.marker = L.marker([-22.4994,  -48.5523], { icon: this.customIcon }).addTo(this.map);

      this.map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
  
        // Move o marcador para o ponto clicado
        this.marker.setLatLng([lat, lng]);
  
        // Captura as coordenadas
        localStorage.setItem("@latitude", lat)
        localStorage.setItem("@longitude", lng)
      });
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Garante que o mapa seja inicializado após o DOM estar disponível
      this.renderer.listen(this.el.nativeElement, 'DOMContentLoaded', () => {
        this.initMap();
      });
      
      // Como fallback, inicializamos com um pequeno delay
      setTimeout(() => {
        this.initMap();
      }, 100);
    }
  }
}