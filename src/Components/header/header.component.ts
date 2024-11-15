import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() isLanding: boolean = false;

  constructor(private router: Router) {}

  navigate(route: string): void {
    this.router.navigate([route])
  }

  quit(): void {
    localStorage.clear();
    this.navigate("/home")
  }
}
