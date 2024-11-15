import { Component, OnInit } from '@angular/core';
import { GameHubServiceService } from '../../services/game-hub-service.service';
import { response } from 'express';
import { CasualGame } from '../../model/CasualGame';
import { HeaderComponent } from '../../Components/header/header.component';
import { CommonModule } from '@angular/common';
import { PositionService } from '../../services/position.service';
import { Position } from '../../model/Position';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-game-hub',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, FaIconComponent, SweetAlert2Module],
  templateUrl: './game-hub.component.html',
  styleUrl: './game-hub.component.scss'
})
export class GameHubComponent implements OnInit{

  constructor(private service : GameHubServiceService, private positionService: PositionService, library: FaIconLibrary) {
    library.addIcons(faClock);
  }

  public data: CasualGame[] = [];

  positions: Position[] = [];
  futPositions: Position[] = [];
  baskPositions: Position[] = [];
  voleiPositions: Position[] = [];

  selectForm!: FormGroup;

  latitude: number = 0;
  longitude: number = 0;
  errorMessage: string | undefined;

  ngOnInit(): void {
    this.selectForm = new FormGroup ({
      position: new FormControl("99")
  })

    this.getGamesByUserLocation();  
  }

  getGamesByUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Armazena as coordenadas
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          localStorage.setItem("@userLatitude", position.coords.latitude.toString());
          localStorage.setItem("@userLongitude", position.coords.longitude.toString());

          console.log(`Latitude: ${this.latitude}, Longitude: ${this.longitude}`);

          this.loadGames();
        },
        (error) => {
          // Tratamento de erro
          this.errorMessage = this.getGeolocationErrorMessage(error);
          console.error('Erro ao obter a localização:', this.errorMessage);
        }
      );
    } else {
      this.errorMessage = 'Geolocalização não é suportada pelo seu navegador.';
    }
  }

  getGeolocationErrorMessage(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Permissão negada para acessar a localização.';
      case error.POSITION_UNAVAILABLE:
        return 'Informação de localização não está disponível.';
      case error.TIMEOUT:
        return 'A solicitação para obter a localização expirou.';
      default:
        return 'Ocorreu um erro desconhecido ao acessar a localização.';
    }
  }

  loadGames(): void {
    
    this.service.getAllGames(this.latitude, this.longitude).subscribe(
      (response) => {
        this.data = response

        this.loadPositions()
      },
      (error) => {
        console.error('Erro ao buscar dados da API', error);
      }
    )
  };

  loadPositions(): void {
    this.positionService.getAll().subscribe(
      (response) => {
        this.positions = response;

        console.log(this.positions)
        this.sepPositions()
      },
      (error) => {
        console.log("Error: " + error)
      }
    )
  }

  sepPositions(): void {
    for (let position of this.positions) {
      if (position.sport === 1)
        this.futPositions.push(position)

      if (position.sport === 2)
        this.baskPositions.push(position)

      if (position.sport === 3)
        this.voleiPositions.push(position)

    }

    console.log(this.futPositions, this.baskPositions)
  }

  participar(opengameId: number): void {
    this.service.participate(Number(localStorage.getItem("@userId")), this.selectForm.get("position")?.value, opengameId).subscribe(
      response => {
        Swal.fire({
          title: 'Sucesso!',
          text: "Agora você está participando desse jogo!",
          icon: 'success',
          confirmButtonText: 'Ok'}
        )
      },
      error => {
        //alert(error.error.message)
        Swal.fire({
          title: 'Alerta!',
          text: error.error.message,
          icon: 'info',
          confirmButtonText: 'Ok'}
        )
      }
    )
  }

}
