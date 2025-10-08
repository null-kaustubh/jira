import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ProjectFull } from 'src/app/types/project';
import { ProjectService } from 'src/app/services/ProjectService/project-service';
import { JwtService } from 'src/app/services/JWT/jwtService';
import { FormsModule } from '@angular/forms';
import { User } from 'src/app/types/User';
import { UserService } from 'src/app/services/user-service';
import { NgSelectModule } from '@ng-select/ng-select';

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

  constructor(
    private route: ActivatedRoute,
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
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.projectId = id ? +id : null;
    });
    this.getAllProjects();
    this.empService.getAllUsers().subscribe({
      next: (res) => {
        this.employees = res.users.filter((u) => u.role === 'EMPLOYEE');
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.employees = [];
      },
    });
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
