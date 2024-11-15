import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../Components/header/header.component";
import { MapComponent } from "../../Components/map/map.component";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Place } from '../../model/Place';
import { LocationService } from '../../services/location.service';
import {FaIconComponent, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faX} from '@fortawesome/free-solid-svg-icons'
import { OpenGame } from '../../model/OpenGame';
import { GameHubServiceService } from '../../services/game-hub-service.service';
import { CommonModule } from '@angular/common';
import { SportsService } from '../../services/sports.service';
import { Sports } from '../../model/Sports';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [HeaderComponent, MapComponent, ReactiveFormsModule, CommonModule, FaIconComponent],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent implements OnInit{

  gameForm!: FormGroup;
  placeForm!: FormGroup;
  selectQuadra!: FormGroup;
  modalActive: boolean = false;
  newPlaceId!: number;
  places!: Place[];
  sports!: Sports[];
  latDefinida: string = "";
  lngDefinida: string = "";

  userId = Number(localStorage.getItem("@userId"))
  userLat!: number;
  userLng!: number;

  constructor(private _locationService: LocationService, private _openGameService: GameHubServiceService, private _sportService: SportsService, library: FaIconLibrary) {
    library.addIcons(faX)
  }

  ngOnInit(): void {
    console.log("iniciou")
    // Inicializando o FormGroup com os FormControl
    this.gameForm = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      sport: new FormControl(''),
      day: new FormControl(''),
      maxPlayers: new FormControl('')
    });

    this.placeForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl('')
    })

    this.selectQuadra = new FormGroup({
      quadra: new FormControl(null)
    })
    
    this.getUserData();
    this.getAllSports();
  }

  cadastrarJogo(): void {
    if (localStorage.getItem("@latitude") !== null) {
      this.modalActive = true;
    }
    else {
      console.log(this.gameForm)
      let newGame: OpenGame = new OpenGame(
        Math.floor(1000 + Math.random() * 9000),
        this.gameForm.get("title")?.value,
        this.gameForm.get("description")?.value,
        this.gameForm.get("sport")?.value,
        this.gameForm.get("maxPlayers")?.value,
        this.gameForm.get("day")?.value,
        this.selectQuadra.get("quadra")?.value.placeId
      )

      this._openGameService.saveOpenGame(this.userId, 99, newGame).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Jogo Criado com sucesso!',
          confirmButtonText: 'OK'
        });
        this.modalActive = false
      }, error => console.log(error)); 
    }
  }

  quadraExists():void {
    localStorage.removeItem("@latitude")
    localStorage.removeItem("@longitude")
    console.log(this.selectQuadra.get("quadra")?.value)
  }

  getQuadrasExistentes(): void {
    this._locationService.getAllLocations(this.userLat, this.userLng).subscribe(data => {
      this.places = data
    }, 
    error => {
      console.log(error)
    })
  }

  cadastrarQuadraJogo(): void {
    let latitude = Number(localStorage.getItem("@latitude"))
    let longitude = Number(localStorage.getItem("@longitude"))

    let newPlace: Place = new Place(
      Math.floor(1000 + Math.random() * 9000),
      this.placeForm.get("name")?.value,
      this.placeForm.get("description")?.value,
      longitude,
      latitude
    )

    this._locationService.saveLocation(newPlace).subscribe(data => {
      this.newPlaceId = data.placeId
      console.log("Quadra cadastrada com sucesso!" + this.newPlaceId)

      let newGame: OpenGame = new OpenGame(
        Math.floor(1000 + Math.random() * 9000),
        this.gameForm.get("title")?.value,
        this.gameForm.get("description")?.value,
        this.gameForm.get("sport")?.value,
        this.gameForm.get("maxPlayers")?.value,
        this.gameForm.get("day")?.value,
        this.newPlaceId
      )

      this._openGameService.saveOpenGame(this.userId, 99,newGame).subscribe(() => {
        this.modalActive = false;
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: "Jogo cadastrado  na Quadra: "+ this.newPlaceId,
          confirmButtonText: 'OK'
        });
      }, error => console.log(error));
    }, 
    error => {
      console.log(error)
    })

    
  }

  getAllSports(): void {
    this._sportService.getAllSports()
    .subscribe(data => {
      this.sports = data
    }, error => {
      console.log(error);
    })
  }

  getUserData(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Armazena as coordenadas
        this.userLat = position.coords.latitude;
        this.userLng = position.coords.longitude;

        this.getQuadrasExistentes();
      },
      (error) => {
        // Tratamento de erro
        console.error('Erro ao obter a localização:', error);
      }
    );

  }

  sairModal(): void {
    this.modalActive = false;
  }
}
