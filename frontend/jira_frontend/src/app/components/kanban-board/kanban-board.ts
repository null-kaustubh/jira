import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Task, TaskStatus } from 'src/app/types/task';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css',
})
export class KanbanBoard {
  taskStatus = ['TO DO', 'IN PROGRESS', 'IN REVIEW', 'DONE'];
  tasks: Task[] = [
    { id: 1, title: 'Design Layout', status: 'TO DO', description: 'random', assignee: 'AK' },
    { id: 2, title: 'Assign tasks', status: 'TO DO', description: 'random2', assignee: 'Kaustubh' },
    { id: 3, title: 'Meeting', status: 'TO DO', description: 'random3', assignee: 'Gaikwad' },
    { id: 4, title: 'Kanban Board', status: 'TO DO', description: 'random4', assignee: 'Kaustubh' },
  ];

  draggingTaskId: number | null = null;
  dragOverStatus: string | null = null;
  dragOverTaskId: number | null = null; // Changed: store task ID
  dragOverPosition: 'before' | 'after' | 'end' = 'end'; // Changed: store position relative to task

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
    draggedTask.status = status as TaskStatus;

    let insertAt: number;

    if (this.dragOverTaskId === null) {
      // Drop at end of column
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
      // Drop relative to a specific task
      const targetIndex = this.tasks.findIndex((t) => t.id === this.dragOverTaskId);

      if (targetIndex !== -1) {
        insertAt = this.dragOverPosition === 'after' ? targetIndex + 1 : targetIndex;
      } else {
        insertAt = this.tasks.length;
      }
    }

    this.tasks.splice(insertAt, 0, draggedTask);
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
}
