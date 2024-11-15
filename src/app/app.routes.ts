
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GameHubComponent } from './game-hub/game-hub.component';
import { LocationComponent } from './location/location.component';
import { PerfilComponent } from './perfil/perfil.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'game-hub', component: GameHubComponent, canActivate: [AuthGuard] },
    { path: 'locations', component: LocationComponent },
    { path: 'profile', component: PerfilComponent },
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent}
];
