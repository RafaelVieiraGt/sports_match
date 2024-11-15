import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { PerfilService } from '../services/perfil.service';
import { User } from '../model/User';
import { error } from 'console';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root', 
})
export class AuthGuard implements CanActivate {

  constructor(private authService: PerfilService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const userId = Number(localStorage.getItem('@userId'));

    return this.authService.getById(userId).pipe(
      map(data => data.active),
      tap(isActive => {
        if (!isActive) {
          this.router.navigate(['/home']); 
        }
      }),
      catchError(error => {
        console.error('Erro ao verificar status do usuário:', error);
        this.router.navigate(['/home']); 
        return of(false);
      })
    );
  }
}
