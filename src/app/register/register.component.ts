import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserServiceService } from '../../services/user-service.service';
import { Router } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{

  constructor(private _userService: UserServiceService, private router: Router, private library: FaIconLibrary){
    library.addIcons(faEye)
  }

  loginForm!: FormGroup;
  viewPasswd: boolean = false;

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(""),
      senha: new FormControl("")
    })
  }

  viewPassword(): void {
    this.viewPasswd = !this.viewPasswd
  }

  login(): void {
    let email = this.loginForm.get("email")?.value;
    let senha = this.loginForm.get("senha")?.value;

    if (email === "" || senha === "") {
      Swal.fire({
        title: 'Atenção!',
        text: "Campos Obrigatórios devem ser preenchidos!",
        icon: 'info',
        confirmButtonText: 'Ok'}
      )

      return;
    }

    this._userService.loginUser(email, senha).subscribe(data => {
      localStorage.setItem("@userId", data.toString());
      this.router.navigate(["/game-hub"]);
    }, error => {
      Swal.fire({
        title: 'Usuário não encontrado!',
        text: "Verifique suas Credenciais!",
        icon: 'info',
        confirmButtonText: 'Ok'}
      )
    })
  }

  navigate(route: string): void {
    this.router.navigate([route])
  }
}
