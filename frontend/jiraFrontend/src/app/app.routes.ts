import { Routes } from '@angular/router';
import { HomeComponent } from "./home/home";

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full'}
];
