import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

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
  projectId : number | null = null;
  userInitial = 'K';

  projects = [
    { id: 1, name: 'Website Redesign' },
    { id: 2, name: 'Internal Tools' },
  ];
  userRole = 'manager';

  constructor(private route: ActivatedRoute) {}
 
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.projectId = id ? +id : null;
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

  createProject(){}
}