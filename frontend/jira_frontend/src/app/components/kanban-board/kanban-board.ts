import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateTaskPayload, Task, TaskStatus } from 'src/app/types/task';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { TaskService } from 'src/app/services/taskService';
import { LucideAngularModule } from 'lucide-angular';
import { User } from 'src/app/types/authInterface';
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './kanban-board.html',
  styleUrls: ['./kanban-board.css'],
})
export class KanbanBoard implements OnInit {
  @Input() projectId!: number;
  taskStatus = ['TO_DO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
  tasks: Task[] = [];
  
  constructor(private route: ActivatedRoute, private taskService : TaskService,private userService: UserService) {}
 
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!isNaN(id) && id > 0) {      
        this.projectId = id;
        this.loadTasks();
        this.loadEmployees();
      }
    });
  }

  loadTasks(): void {
    this.taskService.getTasksByProjectId(this.projectId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
      },
    });
  }
  
  draggingTaskId: number | null = null;
  dragOverStatus: string | null = null;
  dragOverTaskId: number | null = null;
  dragOverPosition: 'before' | 'after' | 'end' = 'end';
  recentlyCompleted = new Set<number>();

  showModal: boolean = false;
  selectedTask: Task | null = null;
  isManagerOrAdmin: boolean = true; 
  
  getTasksByStatus(status: string) {
    return this.tasks.filter((t) => t.status === status);
  }

  onDragStart(event: DragEvent, task: Task) {
    this.draggingTaskId = task.id;
    event.dataTransfer?.setData('text/plain', String(task.id));
    event.dataTransfer!.effectAllowed = 'move';

    const dragElement = event.target as HTMLElement;
    event.dataTransfer?.setDragImage(dragElement, 0, 0);

    dragElement.classList.add('dragging');
  }

  onDragOver(event: DragEvent, status: string, taskId: number | null = null) {
    event.preventDefault();
    event.stopPropagation();

    this.dragOverStatus = status;

    if (taskId !== null) {
      const taskElement = (event.target as HTMLElement).closest('[draggable="true"]');

      if (taskElement) {
        const rect = taskElement.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        const mouseY = event.clientY;

        this.dragOverTaskId = taskId;
        this.dragOverPosition = mouseY > midpoint ? 'after' : 'before';
      }
    } else {
      this.dragOverTaskId = null;
      this.dragOverPosition = 'end';
    }
  }

  onDrop(event: DragEvent, status: string) {
    event.preventDefault();
    if (this.draggingTaskId == null) return;

    const taskIndex = this.tasks.findIndex((t) => t.id === this.draggingTaskId);
    if (taskIndex === -1) return;

    const [draggedTask] = this.tasks.splice(taskIndex, 1);

    const prevStatus = draggedTask.status;
    draggedTask.status = status as TaskStatus;

    let insertAt: number;
    if (this.dragOverTaskId === null) {
      const columnTasks = this.tasks.filter((t) => t.status === status);
      if (columnTasks.length > 0) {
        const lastTaskIndex = this.tasks.findIndex(
          (t) => t.id === columnTasks[columnTasks.length - 1].id
        );
        insertAt = lastTaskIndex + 1;
      } else {
        insertAt = this.tasks.length;
      }
    } else {
      const targetIndex = this.tasks.findIndex((t) => t.id === this.dragOverTaskId);
      if (targetIndex !== -1) {
        insertAt = this.dragOverPosition === 'after' ? targetIndex + 1 : targetIndex;
      } else {
        insertAt = this.tasks.length;
      }
    }

    this.tasks.splice(insertAt, 0, draggedTask);

    if ((status === 'DONE' && prevStatus !== 'DONE') ||
        (status === 'TO DO' && prevStatus !== 'TO_DO') ||
        (status === 'IN REVIEW' && prevStatus !== 'IN_REVIEW')||
        (status === 'IN PROGRESS' && prevStatus !== 'IN_PROGRESS')) {
      this.recentlyCompleted.add(draggedTask.id);
      setTimeout(() => {
        this.recentlyCompleted.delete(draggedTask.id);
      }, 900);
    }
    
    this.clearDragState();
  }

  onDragEnd(event: DragEvent) {
    (event.target as HTMLElement).classList.remove('dragging');
    this.clearDragState();
  }

  clearDragState() {
    this.draggingTaskId = null;
    this.dragOverStatus = null;
    this.dragOverTaskId = null;
    this.dragOverPosition = 'end';
  }

  openModal(task: Task) {
    this.selectedTask = { ...task };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedTask = null;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'TO DO':
        return 'status-todo';
      case 'IN PROGRESS':
        return 'status-in-progress';
      case 'IN REVIEW':
        return 'status-in-review';
      case 'DONE':
        return 'status-done';
      default:
        return '';
    }
  }

  saveTask() {
    if (this.selectedTask) {
      const index = this.tasks.findIndex((t) => t.id === this.selectedTask!.id);
      if (index !== -1) {
        this.tasks[index] = { ...this.selectedTask };
      }
      this.closeModal();
    }
  }

  getColumnGradient(index: number): string {
    const classes = ['bg-gradient-to-t from-blue-800 via-indigo-900 to-slate-900 text-white hover:shadow-[0_24px_80px_rgba(79,70,229,0.45)] hover:ring-4 hover:ring-indigo-500/40',
      'bg-gradient-to-t from-blue-700 via-sky-900 to-slate-900 text-white hover:shadow-[0_24px_80px_rgba(14,165,233,0.4)] hover:ring-4 hover:ring-sky-400/35',
      'bg-gradient-to-t from-cyan-700 via-teal-900 to-slate-900 text-white hover:shadow-[0_24px_80px_rgba(20,184,166,0.38)] hover:ring-4 hover:ring-teal-400/35',
      'bg-gradient-to-t from-indigo-700 via-purple-900 to-slate-900 text-white hover:shadow-[0_24px_80px_rgba(168,85,247,0.36)] hover:ring-4 hover:ring-purple-400/30'];
    return classes[index] || classes[0];
  }
  
  getGlowBarClass(index: number): string {
    const glowClasses = ['bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 shadow-[0_0_20px_4px_rgba(99,102,241,0.6)]',
      'bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-500 shadow-[0_0_20px_4px_rgba(56,189,248,0.6)]',
      'bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 shadow-[0_0_20px_4px_rgba(45,212,191,0.6)]',
      'bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 shadow-[0_0_20px_4px_rgba(147,51,234,0.6)]'];
    return glowClasses[index] || glowClasses[0];
  }

  isCreateTaskModalOpen = false;
  employees: User[] = [];

  newTask: CreateTaskPayload = {
    title: '',
    description: '',
    type: 'FEATURE', 
    priority: 'MEDIUM',
    assignee: { user_id: null },
  };

  loadEmployees() {
    this.userService.getAllUsers().subscribe(response => {
      this.employees = response.users.filter(user => user.role === 'EMPLOYEE');
    });
  }

  openCreateTaskModal() {
    this.isCreateTaskModalOpen = true;
  }

  closeCreateTaskModal() {
    this.isCreateTaskModalOpen = false;
    this.newTask = {
      title: '',
      description: '',
      type: 'FEATURE',
      priority: 'MEDIUM',
      assignee: { user_id: null },
    };
  }

  submitCreateTask() {
    if (!this.projectId) {
      console.error('Project ID is missing');
      return;
    }
    if (!this.newTask.assignee.user_id) {
        alert('Please assign the task to an employee.');
        return;
    }

    this.taskService.createTask(this.projectId, this.newTask).subscribe({
      next: (createdTask) => {
        console.log('Task created successfully!', createdTask);
        this.closeCreateTaskModal();
        this.loadTasks();
      },
      error: (err) => {
        console.error('Failed to create task', err);
        alert('Error: Could not create the task.');
      },
    });
  }
}
