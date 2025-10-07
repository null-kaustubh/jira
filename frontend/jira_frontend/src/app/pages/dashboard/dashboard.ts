import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ProjectFull } from 'src/app/types/project';
import { ProjectService } from 'src/app/services/ProjectService/project-service';
import { JwtService } from 'src/app/services/JWT/jwtService';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class MainLayoutComponent {
  isSidebarCollapsed = false;
  projectsExpanded = false;
  projectId: number | null = null;
  userInitial = 'K';
  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private jwtService: JwtService
  ) {}

  projects: ProjectFull[] = [];
  isLoading = true;
  userRole: string | null = null;

  ngOnInit() {
    this.userRole = this.jwtService.getUserRole();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.projectId = id ? +id : null;
    });
    this.getAllProjects();
  }

  getAllProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = Array.isArray(data) && data.length ? data : [];
        this.isLoading = false;
      },
    });
  }

  toggleProjects() {
    this.projectsExpanded = !this.projectsExpanded;
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    console.log('Logout clicked');
  }

  createProject() {}
}
