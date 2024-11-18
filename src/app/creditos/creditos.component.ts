import { Component } from '@angular/core';
import { HeaderComponent } from "../../Components/header/header.component";
import { FooterComponent } from "../../Components/footer/footer.component";

@Component({
  selector: 'app-creditos',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './creditos.component.html',
  styleUrl: './creditos.component.scss'
})
export class CreditosComponent {

}
