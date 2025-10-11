import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/types/authInterface';
import { ProjectService } from 'src/app/services/project-service';
import { JwtService } from 'src/app/services/jwtService';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employees.html',
})
export class Employees implements OnInit {
  employees: User[] = [];
  projectId!: number;
  projectName = '';
  isLoading = true;
  role :string|null = null;

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private jwtService : JwtService ) {}

  ngOnInit(): void {
    this.role = this.jwtService.getUserRole();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.projectId = +idParam;
      this.loadEmployees();
    } else {
      console.error('Project ID not found in route parameters.');
      this.isLoading = false;
    }
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (projectData) => {
        const allEmployees = projectData.employees || [];
        this.employees = []; 
        this.projectName = projectData.name;
        this.isLoading = false;
        allEmployees.forEach((emp, index) => {
          setTimeout(() => {
            this.employees.push(emp);
          }, index * 100); 
        });
      },
      error: (err) => {
        console.error('Error fetching project employees:', err);
        this.isLoading = false;
      },
    });
  }
  

  addEmployee(): void {
    console.log('Add Employee clicked');
    alert('Add employee functionality is not yet implemented.');
  }

  removeEmployee(userId: number): void {
    // if (confirm('Are you sure you want to remove this employee from the project?')) {
    //   this.projectService.removeEmployeeFromProject(this.projectId, userId).subscribe({
    //     next: () => {
    //       this.employees = this.employees.filter((emp) => emp.user_id !== userId);
    //     },
    //     error: (err: any) => {
    //       console.error('Failed to remove employee:', err.message);
    //       alert('Could not remove employee. Please try again.');
    //     },
    //   });
    // }
  }
}