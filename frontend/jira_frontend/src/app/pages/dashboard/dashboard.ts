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
import { Project, ProjectFull, UpdateProject } from 'src/app/types/project';
import { ProjectService } from 'src/app/services/project-service';
import { JwtService } from 'src/app/services/jwtService';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user-service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Navbar } from 'src/app/components/navbar/navbar';
import { filter } from 'rxjs';
import { User } from 'src/app/types/authInterface';
import { ZardDropdownModule } from '@shared/components/dropdown/dropdown.module';
import { ZardButtonComponent } from '@shared/components/button/button.component';

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
    ZardDropdownModule,
    ZardButtonComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class MainLayoutComponent {
  isSidebarCollapsed = false;
  projectsExpanded = false;
  projectId: number | null = null;
  showEmployeeDropdown = false;
  showNavbar = false;
  projectName: string = '';
  isEditProjectModalOpen = false;
  editingProject: ProjectFull | null = null;
  menuRefs: Record<number, any> = {};

  // User dropdown properties
  userInitial = '?';
  userName = '';
  userEmail = '';
  showUserMenu = false;

  projects: ProjectFull[] = [];
  isLoading = true;
  userRole: string | null = null;
  employees: User[] = [];
  selectedEmployeeIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private jwtService: JwtService,
    private empService: UserService
  ) {}

  ngOnInit() {
    // Decode JWT and extract user info
    const email = this.jwtService.getUserEmail();
    this.userEmail = email || '';
    this.userInitial = email ? email.charAt(0).toUpperCase() : '?';
    this.userRole = this.jwtService.getUserRole() || '';

    // Fetch user full name from backend
    this.empService.getAllUsers().subscribe({
      next: (res) => {
        const userId = this.jwtService.getUserId();
        const currentUser = res.users.find((u) => u.user_id === userId);
        if (currentUser) {
          this.userName = currentUser.username || this.userEmail;
        } else {
          this.userName = this.userEmail;
        }
        this.employees = res.users.filter((u) => u.role === 'EMPLOYEE');
      },
      error: () => {
        this.userName = this.userEmail;
        this.employees = [];
      },
    });

    // Handle project context
    this.updateProjectContext();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateProjectContext();
    });

    // Load projects
    this.getAllProjects();
  }

  // Toggle User Menu
  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  // Logout User
  logout() {
    localStorage.removeItem('token');
    this.showUserMenu = false;
    this.router.navigate(['/login']);
  }

  // Project Context
  updateProjectContext() {
    const url = this.router.url;
    const projectMatch = url.match(/\/projects\/(\d+)/);

    if (projectMatch) {
      const newProjectId = +projectMatch[1];
      this.projectId = newProjectId;
      this.showNavbar = true;

      this.projectService.getProjectById(newProjectId).subscribe({
        next: (project) => (this.projectName = project.name),
        error: () => (this.projectName = 'Unknown Project'),
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

  openEditProjectModal(project: ProjectFull) {
    this.editingProject = { ...project };
    this.selectedEmployeeIds = project.employees?.map((emp: any) => emp.user_id) || [];
    this.isEditProjectModalOpen = true;
  }

  closeEditProjectModal() {
    this.isEditProjectModalOpen = false;
    this.editingProject = null;
    this.selectedEmployeeIds = [];
  }

  submitEditProject() {
    if (!this.editingProject) return;

    const payload: UpdateProject = {
      name: this.editingProject.name,
      description: this.editingProject.description,
      employeeIds: this.selectedEmployeeIds,
      status: this.editingProject.status,
      manager: this.editingProject.manager,
    };

    this.projectService.updateProject(payload, this.editingProject.projectId).subscribe({
      next: () => {
        this.getAllProjects();
        this.closeEditProjectModal();
      },
      error: () => alert('Failed to update project'),
    });
  }

  deleteProject(projectId: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          this.projects = this.projects.filter((p) => p.projectId !== projectId);
          if (this.projectId === projectId) this.router.navigate(['']);
        },
        error: () => alert('Failed to delete project'),
      });
    }
  }
}