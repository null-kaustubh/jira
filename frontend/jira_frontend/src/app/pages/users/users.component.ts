import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Ensure this User import is from the correct file
import { User } from 'src/app/services/AuthService/authInterface';
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

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.users.length ? data.users as User[] : [];
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

  // The type of 'id' is now correctly 'string'
  handleDeleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          // This comparison is now valid (string === string)
          this.users = this.users.filter(user => user.id !== id);
        },
        error: (err) => {
          console.error('Failed to delete user', err);
        },
      });
    }
  }
}