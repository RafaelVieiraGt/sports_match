import { Component } from '@angular/core';
import { HeaderComponent } from "../../Components/header/header.component";
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faClock, faPencil, faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../model/User';
import { PerfilService } from '../../services/perfil.service';
import { CasualGame } from '../../model/CasualGame';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Position } from '../../model/Position';
import { PositionService } from '../../services/position.service';
import { EditPerfilDTO } from '../../model/EditPerfilDTO';
import Swal from 'sweetalert2';
import { UserPhoto } from '../../model/UserPhoto';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderComponent, FaIconComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {

  user!: User;
  nextGame!: CasualGame;
  editarPerfilModal: boolean = false;
  editProfile!: FormGroup;
  positions!: Position[];
  selectedFileName!: string ;
  fileBase64!: string ;
  userPhoto!: UserPhoto;

  userId: number = Number(localStorage.getItem("@userId"));
  userPosition!: string;

  latitude: number = Number(localStorage.getItem("@userLatitude"))
  longitude: number = Number(localStorage.getItem("@userLongitude"))

  constructor(library: FaIconLibrary, private _perfilService: PerfilService, private route: Router, private _positionService: PositionService) {
    library.addIcons(faX);
    library.addIcons(faPencil);
    library.addIcons(faClock);
    library.addIcons(faPlus);
  }

  ngOnInit() {
    this.editProfile = new FormGroup({
      nome: new FormControl(""),
      descricao: new FormControl(""),
      position: new FormControl(0)
    })

    this.getUserById();
    this.loadNextGame();
    this.loadUserPhoto(this.userId)
  }

  getUserById(): void {
    this._perfilService.getById(this.userId).subscribe(data => {
      this.user = data
      this.getAllPositions(data.userFavPosition)
      console.log(this.user)
    }, error => {
      console.log(error)
    })
  }

  getAllPositions(id: number): void {
    this._positionService.findBySport(id).subscribe(data => {
      this.positions = data
      this.findUserPosition(this.user.userFavPosition)
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

  loadUserPhoto(userId: number) {
    this._perfilService.getPhoto(userId).subscribe(data => {
      this.userPhoto = data
      console.log("foto: " + this.userPhoto)
    }, error => {
      console.log(error)
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      this.convertFileToBase64(input.files[0])
    }
  }

  findUserPosition(id: number): void {
    for (let p of this.positions) {
      if (p.positionId === id)
        this.userPosition = p.positionName
    }
  }

  private convertFileToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.fileBase64 = reader.result as string;
      console.log('Base64:', this.fileBase64);
    };
    reader.readAsDataURL(file);
  }

  navigate(to: string): void {
    this.route.navigate([to]);
  }

  edit(): void {
    let dto: EditPerfilDTO = new EditPerfilDTO(
      this.editProfile.get("nome")?.value === "" ? null : this.editProfile.get("nome")?.value,
      this.editProfile.get("descricao")?.value === "" ? null : this.editProfile.get("descricao")?.value,
      this.fileBase64.split(",")[1],
      this.editProfile.get("position")?.value === 0 ? null : this.editProfile.get("position")?.value
    )

    this._perfilService.edit(this.userId, dto).subscribe(data => {
      this.editarPerfil()
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Perfil Atualizado com sucesso!',
        confirmButtonText: 'OK'
      });
    }, error => {
      console.log(error)
    })
  }

  editarPerfil(): void {
    this.editarPerfilModal = !this.editarPerfilModal
  }
   
}
