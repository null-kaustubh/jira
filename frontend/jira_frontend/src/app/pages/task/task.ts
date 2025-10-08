import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from 'src/app/types/task';

@Component({
  selector: 'app-task',
  imports: [FormsModule,CommonModule],
  templateUrl: './task.html',
  styleUrl: './task.css'
})
export class TaskComponent {
  task: Task = {
    id: 0,
    title: '',
    priority: 'MEDIUM',
    status: 'TO DO',
    description: '',
    assignee: '',
    created_at: new Date(),
    due_date: undefined
  };

  onSubmit() {
    console.log('Task submitted:', this.task);
    alert('Task submitted successfully!');
  }
}
