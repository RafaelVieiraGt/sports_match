import { routes } from './app.routes';
import { AuthGuard } from '../guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { GameHubComponent } from './game-hub/game-hub.component';
import { LocationComponent } from './location/location.component';
import { PerfilComponent } from './perfil/perfil.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CreditosComponent } from './creditos/creditos.component';

describe('app routes', () => {
  const find = (path: string) => routes.find(r => r.path === path);

  it('should redirect the empty path to /home', () => {
    expect(find('')).toEqual(jasmine.objectContaining({ redirectTo: '/home', pathMatch: 'full' }));
  });

  it('should map public routes without guards', () => {
    expect(find('home')?.component).toBe(HomeComponent);
    expect(find('login')?.component).toBe(LoginComponent);
    expect(find('register')?.component).toBe(RegisterComponent);
    expect(find('home')?.canActivate).toBeUndefined();
    expect(find('login')?.canActivate).toBeUndefined();
    expect(find('register')?.canActivate).toBeUndefined();
  });

  it('should protect private routes with AuthGuard', () => {
    const privateRoutes = [
      { path: 'game-hub', component: GameHubComponent },
      { path: 'locations', component: LocationComponent },
      { path: 'profile', component: PerfilComponent },
      { path: 'creditos', component: CreditosComponent }
    ];

    for (const { path, component } of privateRoutes) {
      const route = find(path);
      expect(route?.component).withContext(path).toBe(component);
      expect(route?.canActivate).withContext(path).toEqual([AuthGuard]);
    }
  });
});
