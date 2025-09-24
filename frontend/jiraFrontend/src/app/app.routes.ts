import { Routes } from '@angular/router';
import { HomeComponent } from "./pages/home/home";
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'dashboard', component: Dashboard},
    {path: 'login', component: Login}
];
