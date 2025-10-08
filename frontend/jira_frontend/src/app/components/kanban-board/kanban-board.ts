import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus } from 'src/app/types/task';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './kanban-board.html',
  styleUrls: ['./kanban-board.css'],
})
export class KanbanBoard {
  @Input() projectId!: number;
  taskStatus = ['TO DO', 'IN PROGRESS', 'IN REVIEW', 'DONE'];
  tasks: Task[] = [
    { id: 1, title: 'Design Layout', status: 'TO DO', description: 'random', assignee: 'AK' },
    { id: 2, title: 'Assign tasks', status: 'TO DO', description: 'random2', assignee: 'Kaustubh' },
    { id: 3, title: 'Meeting', status: 'TO DO', description: 'random3', assignee: 'Gaikwad' },
    { id: 4, title: 'Kanban Board', status: 'TO DO', description: 'Develop Kanban board UI', assignee: 'mahesh' },
  ];

  draggingTaskId: number | null = null;
  dragOverStatus: string | null = null;
  dragOverTaskId: number | null = null;
  dragOverPosition: 'before' | 'after' | 'end' = 'end';
  recentlyCompleted = new Set<number>();

  showModal: boolean = false;
  selectedTask: Task | null = null;
  isManagerOrAdmin: boolean = true; // Hardcoded for testing; replace with auth service

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

    if (status === 'DONE' && prevStatus !== 'DONE') {
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
    this.selectedTask = { ...task }; // Create a copy to avoid direct mutation
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
      const index = this.tasks.findIndex(t => t.id === this.selectedTask!.id);
      if (index !== -1) {
        this.tasks[index] = { ...this.selectedTask };
      }
      this.closeModal();
    }
  }
}