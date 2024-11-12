import { Component } from '@angular/core';
import { HeaderComponent } from "../../Components/header/header.component";
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faClock, faPencil, faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../model/User';
import { PerfilService } from '../../services/perfil.service';
import { CasualGame } from '../../model/CasualGame';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderComponent, FaIconComponent, CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {

  user!: User;
  nextGame!: CasualGame;

  latitude: number = Number(localStorage.getItem("@userLatitude"))
  longitude: number = Number(localStorage.getItem("@userLongitude"))

  constructor(library: FaIconLibrary, private _perfilService: PerfilService, private route: Router) {
    library.addIcons(faX);
    library.addIcons(faPencil);
    library.addIcons(faClock);
    library.addIcons(faPlus);
  }

  ngOnInit() {
    this.getUserById();
    this.loadNextGame();
  }

  getUserById(): void {
    this._perfilService.getById(1).subscribe(data => {
      this.user = data
      console.log(this.user)
    }, error => {
      console.log(error)
    })
  }

  loadNextGame(): void {

    if (this.latitude === null || this.longitude === null) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Armazena as coordenadas
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;

          this.findNextGame();
        },
        (error) => {
          // Tratamento de erro
          console.error('Erro ao obter a localização:', error);
        }
      );
    }
    else {
      this.findNextGame();
    }
  
  }

  findNextGame() : void {
    this._perfilService.getNextGame(this.latitude, this.longitude).subscribe(
      data => {
        this.nextGame = data
      },
      error => {
        console.log(error)
      }
    )
  }

  navigate(to: string): void {
    this.route.navigate([to]);
  }
   
}
