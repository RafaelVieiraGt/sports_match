import { Component, OnInit } from '@angular/core';
import { SportsService } from '../../services/sports.service';
import { Sports } from '../../model/Sports';
import { Position } from '../../model/Position';
import { PositionService } from '../../services/position.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CepMaskDirective } from '../../directives/cep-mask.directive';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCity, faEye, faMap, faRoad } from '@fortawesome/free-solid-svg-icons';
import { Cep } from '../../model/Cep';
import { AddressService } from '../../services/address.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { User } from '../../model/User';
import { UserServiceService } from '../../services/user-service.service';
import { UserDTO } from '../../model/UserDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CepMaskDirective, FaIconComponent, SweetAlert2Module],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  template: `
    <input type="text" appCepMask placeholder="Digite seu CEP" maxlength="9">
  ` 
})
export class LoginComponent implements OnInit{

  sports!: Sports[]
  positions: Position[] = [];
  futPositions: Position[] = [];
  baskPositions: Position[] = [];
  voleiPositions: Position[] = [];
  registerForm!: FormGroup;
  modalActive: boolean = false;
  viewPasswd: boolean = false;
  cep!: Cep;

  constructor(private router: Router, private _sportsService: SportsService, private _positionService: PositionService, library: FaIconLibrary, private _addressService: AddressService, private _userService : UserServiceService) {
    library.addIcons(faCity);
    library.addIcons(faRoad);
    library.addIcons(faMap);
    library.addIcons(faEye)
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl(""),
      email: new FormControl(""),
      senha: new FormControl(""),
      sport: new FormControl(""),
      position: new FormControl(""),
      cep: new FormControl("")
    });

    this.loadSports();
    this.loadPositions();
  }

  loadSports(): void {
    this._sportsService.getAllSports().subscribe(
      data => {
        this.sports = data;
      }, error => {
        console.log(error)
      })
  }

  loadPositions(): void {
    this._positionService.getAll().subscribe(data => {
      this.positions = data;
      this.sepPositions();
    }, error => {
      console.log(error)
    })
  }

  viewPassword(): void {
    this.viewPasswd = !this.viewPasswd
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

  handleChange(): void {
    console.log(this.registerForm.get("sport")?.value)
  }

  confirmCep(): void {
    if (this.registerForm.get("name")?.value === "" || 
        this.registerForm.get("email")?.value === "" || 
        this.registerForm.get("senha")?.value === "" ||
        this.registerForm.get("cep")?.value === "") {
          Swal.fire({
            title: 'Atenção!',
            text: "Campos Obrigatórios devem ser preenchidos!",
            icon: 'info',
            confirmButtonText: 'Ok'}
          )
        }

    let cep = Number(this.registerForm.get("cep")?.value.replace(/\D/g, ''));

    this._addressService.loadCep(cep).subscribe(data => {
      this.cep = data;
      this.modalActive = true;
    }, error => {
      console.log(error);
    })
  }

  closeModal(): void {
    this.modalActive = false;
  }
  
  register() {
    this._addressService.createAddress(Number(this.registerForm.get("cep")?.value.replace(/\D/g, '')))
      .subscribe(data => {
        let user : UserDTO = new UserDTO(
          this.registerForm.get("name")?.value === "" ? null : this.registerForm.get("name")?.value,
          this.registerForm.get("email")?.value === "" ? null : this.registerForm.get("email")?.value,
          this.registerForm.get("senha")?.value === "" ? null : this.registerForm.get("senha")?.value,
          this.registerForm.get("sport")?.value === "" ? null : this.registerForm.get("sport")?.value,
          this.registerForm.get("position")?.value === "" ? null : this.registerForm.get("position")?.value,
          data.toString()
        )

        this.registerUser(user);
      }, error => {
        Swal.fire({
          title: 'Atenção!',
          text: "Email já está em uso!",
          icon: 'info',
          confirmButtonText: 'Ok'}
        )
      })
    }

    registerUser(user: UserDTO): void {
      this._userService.createUser(user)
      .subscribe(data => {
        localStorage.setItem("@userId", data.userId.toString());
        this.router.navigate(["/game-hub"]);
      }, error => {
        this.modalActive = false;
        Swal.fire({
          title: 'Atenção!',
          text: "Email já está em uso!",
          icon: 'info',
          confirmButtonText: 'Ok'}
        )
      })
    }

    navigate(route: string): void {
      this.router.navigate([route])
    }
  }

