import { Component } from '@angular/core';
import { Dashboard } from '../dashboard/dashboard';

@Component({
  selector: 'app-home',
  imports: [Dashboard],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  
}
