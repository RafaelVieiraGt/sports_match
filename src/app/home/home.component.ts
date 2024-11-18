import { Component } from '@angular/core';
import { FooterComponent } from '../../Components/footer/footer.component';
import { HeaderComponent } from "../../Components/header/header.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private router: Router) {}
  navigate(route: string): void {
    this.router.navigate([route])
  }
}
