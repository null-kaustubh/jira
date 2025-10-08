import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Ensure this User import is from the correct file
import { User } from 'src/app/services/AuthService/authInterface';
import { JwtService } from 'src/app/services/JWT/jwtService';
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  role : string | null = null;

  constructor(private userService: UserService, private router: Router, private jwtService : JwtService) {}

  ngOnInit(): void {
    this.role = this.jwtService.getUserRole();
    if( "ADMIN".toUpperCase() === this.role) this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.users.length ? data.users : [];
        console.log(this.users);
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.isLoading = false;
      },
    });
  }

  createNewUser(): void {
    this.router.navigate(['/register']);
  }

  handleDeleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.user_id !== id);
        },
        error: (err) => {
          console.error('Failed to delete user', err);
        },
      });
    }
  }
}