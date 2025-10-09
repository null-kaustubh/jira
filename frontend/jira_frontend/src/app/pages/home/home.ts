import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwtService';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  username = 'Aditya';

  userRole: string | null = null;
  userEmail: string | null = null;

  constructor(private router: Router, private jwtService: JwtService) {}

  ngOnInit(): void {
    this.userRole = this.jwtService.getUserRole();
    this.userEmail = this.jwtService.getUserEmail();
  }
  
  tasks = [
    { id: 1, text: 'Finalize the Q3 project proposal', completed: false },
    { id: 2, text: 'Review new user interface mockups', completed: false },
    { id: 3, text: 'Schedule a team sync meeting', completed: true },
  ];

  recentProjects = [
    { id: 'p1', name: 'Project Phoenix', progress: 75, members: 5 },
    { id: 'p2', name: 'Mobile App Relaunch', progress: 40, members: 8 },
    { id: 'p3', name: 'API Integration', progress: 90, members: 3 },
  ];

  weeklyProgress = 68;
  
  get progressOffset() {
    const circumference = 2 * Math.PI * 45; // 2 * pi * radius
    return circumference - (this.weeklyProgress / 100) * circumference;
  }
}