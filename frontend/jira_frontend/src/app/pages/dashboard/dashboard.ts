import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterLink,
  RouterOutlet,
  RouterLinkActive,
  ActivatedRoute,
  Router,
  NavigationEnd,
} from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ProjectFull } from 'src/app/types/project';
import { ProjectService } from 'src/app/services/project-service';
import { JwtService } from 'src/app/services/jwtService';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user-service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Navbar } from 'src/app/components/navbar/navbar';
import { filter } from 'rxjs';
import { User } from 'src/app/types/authInterface';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
    FormsModule,
    NgSelectModule,
    Navbar,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class MainLayoutComponent {
  isSidebarCollapsed = false;
  projectsExpanded = false;
  projectId: number | null = null;
  userInitial = 'K';
  showEmployeeDropdown = false;
  showNavbar = false;
  projectName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private jwtService: JwtService,
    private empService: UserService
  ) {}

  projects: ProjectFull[] = [];
  isLoading = true;
  userRole: string | null = null;
  employees: User[] = [];
  selectedEmployeeIds: number[] = [];

  ngOnInit() {
    this.userRole = this.jwtService.getUserRole();

    // Initial check
    this.updateProjectContext();

    // Listen to navigation changes
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateProjectContext();
    });

    this.getAllProjects();

    this.empService.getAllUsers().subscribe({
      next: (res) => {
        this.employees = res.users.filter((u) => u.role === 'EMPLOYEE');
      },
      error: (err) => {
        this.employees = [];
      },
    });
  }

  updateProjectContext() {
    const url = this.router.url;

    // Match URLs like /projects/123/summary, /projects/123/tasks, etc.
    const projectMatch = url.match(/\/projects\/(\d+)/);

    if (projectMatch) {
      const newProjectId = +projectMatch[1];

      this.projectId = newProjectId;
      this.showNavbar = true;

      // Fetch project name
      this.projectService.getProjectById(newProjectId).subscribe({
        next: (project) => {
          this.projectName = project.name;
        },
        error: (err) => {
          this.projectName = 'Unknown Project';
        },
      });
    } else {
      this.projectId = null;
      this.projectName = '';
      this.showNavbar = false;
    }
  }

  toggleEmployeeSelection(employeeId: number, event: any) {
    if (event.target.checked) {
      this.selectedEmployeeIds.push(employeeId);
    } else {
      this.selectedEmployeeIds = this.selectedEmployeeIds.filter((id) => id !== employeeId);
    }
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

  isCreateProjectModalOpen = false;

  newProject: any = {
    name: '',
    description: '',
    managerId: null,
    employeeIdsString: '',
    status: 'ACTIVE',
  };

  openCreateProjectModal() {
    this.isCreateProjectModalOpen = true;
  }

  closeCreateProjectModal() {
    this.isCreateProjectModalOpen = false;
    this.newProject = {
      name: '',
      description: '',
      managerId: null,
      employeeIdsString: '',
      status: 'ACTIVE',
    };
  }

  submitCreateProject() {
    const userId = this.jwtService.getUserId();

    const payload = {
      name: this.newProject.name,
      description: this.newProject.description,
      manager_id: userId,
      employeeIds: this.selectedEmployeeIds,
      status: this.newProject.status,
    };

    this.projectService.createProject(payload).subscribe({
      next: () => {
        this.getAllProjects();
        this.closeCreateProjectModal();
      },
      error: (err) => {
        console.error('Error creating project:', err);
        alert('Failed to create project');
      },
    });
  }
}
