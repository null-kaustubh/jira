import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  ActivatedRoute,
  RouterLink,
  RouterOutlet,
  RouterLinkActive,
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
export class MainLayoutComponent implements OnInit {
  // layout state
  isSidebarCollapsed = false;
  projectsExpanded = false;

  // project context
  projectId: number | null = null;
  projectName: string = '';
  showNavbar = false;

  // user info / dropdown
  userInitial = 'K';
  userName: string = '';
  userEmail: string = '';
  userRole: string | null = null;
  showUserMenu = false;

  // projects / employees
  projects: ProjectFull[] = [];
  employees: User[] = [];
  isLoading = true;

  // create / edit modals
  isCreateProjectModalOpen = false;
  isEditProjectModalOpen = false;
  editingProject: ProjectFull | null = null;

  // selection state
  selectedEmployeeIds: number[] = [];
  showEmployeeDropdown = false;

  // misc
  menuRefs: Record<number, any> = {};

  // form model for new project
  newProject: any = {
    name: '',
    description: '',
    managerId: null,
    employeeIdsString: '',
    status: 'ACTIVE',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private jwtService: JwtService,
    private userService: UserService,
    private elRef: ElementRef
  ) {}

  ngOnInit() {
    // read token-derived info
    this.userRole = this.jwtService.getUserRole();
    const email = this.jwtService.getUserEmail();
    this.userEmail = email ?? 'unknown@example.com';
    this.userInitial = this.userEmail ? this.userEmail.charAt(0).toUpperCase() : '?';

    // update project context on route changes
    this.updateProjectContext();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateProjectContext();
    });

    // load projects
    this.getAllProjects();

    // load users once: set employees and current user's display name
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        // employees list (for selection)
        this.employees = Array.isArray(res.users) ? res.users.filter((u) => u.role === 'EMPLOYEE') : [];

        // derive current user's name (if available)
        const userId = this.jwtService.getUserId();
        const currentUser = Array.isArray(res.users) ? res.users.find((u) => u.user_id === userId) : null;
        if (currentUser) {
          this.userName = currentUser.username ?? this.userEmail;
          this.userInitial = (currentUser.username ? currentUser.username.charAt(0) : this.userEmail.charAt(0)).toUpperCase();
        } else {
          this.userName = this.userEmail;
        }
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
        this.employees = [];
        this.userName = this.userEmail;
      },
    });
  }

  // Close dropdown if clicked outside component
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target) && this.showUserMenu) {
      this.showUserMenu = false;
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  // Sidebar/project toggles
  toggleProjects() {
    this.projectsExpanded = !this.projectsExpanded;
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Projects API
  getAllProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        // Accept array or fallback to empty
        this.projects = Array.isArray(data) && data.length ? (data as any) : [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load projects', err);
        this.projects = [];
        this.isLoading = false;
      },
    });
  }

  updateProjectContext() {
    const url = this.router.url;

    const projectMatch = url.match(/\/projects\/(\d+)/);

    if (projectMatch) {
      const newProjectId = +projectMatch[1];

      this.projectId = newProjectId;
      this.showNavbar = true;

      // fetch project name for header (safe)
      this.projectService.getProjectById(newProjectId).subscribe({
        next: (project) => {
          this.projectName = project.name;
        },
        error: () => {
          this.projectName = 'Unknown Project';
        },
      });
    } else {
      this.projectId = null;
      this.projectName = '';
      this.showNavbar = false;
    }
  }

  // Employee multi-select toggles for create/edit
  toggleEmployeeSelection(employeeId: number, event: any) {
    if (event.target.checked) {
      if (!this.selectedEmployeeIds.includes(employeeId)) this.selectedEmployeeIds.push(employeeId);
    } else {
      this.selectedEmployeeIds = this.selectedEmployeeIds.filter((id) => id !== employeeId);
    }
  }

  // Create project flow
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
    this.selectedEmployeeIds = [];
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

  // Edit project flow
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
      error: (err) => {
        console.error('Failed to update project', err);
        alert('Failed to update project');
      },
    });
  }

  deleteProject(projectId: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          this.projects = this.projects.filter(project => project.projectId !== projectId);
          if (this.projectId === projectId) this.router.navigate(['']);
        },
        error: (err) => alert('Failed to delete project'),
      });
    }
  }

  createProject() {}
  editProject(projectId: number) {}
}
