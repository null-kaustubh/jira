import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { JwtService } from 'src/app/services/jwtService';
import { ProjectService } from 'src/app/services/project-service';

import { ProjectFull } from 'src/app/types/project';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  username: string | null = null;

  userRole: string | null = null;
  userEmail: string | null = null;

  projects: ProjectFull[] = [];
  isLoading = true;


  constructor(private router: Router, private jwtService: JwtService,private projectService: ProjectService) {}

  ngOnInit(): void {
    this.userRole = this.jwtService.getUserRole();
    this.userEmail = this.jwtService.getUserEmail();
    
    this.username = this.jwtService.getUsername();
    this.loadProjects();
  }
  

  loadProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error fetching projects", err);
        this.isLoading = false;
      }
    });
  }

 
}