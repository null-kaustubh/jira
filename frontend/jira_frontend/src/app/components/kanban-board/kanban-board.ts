import { Component } from '@angular/core';
import { Task, TaskStatus } from 'src/app/types/task';

@Component({
  selector: 'app-kanban-board',
  imports: [],
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

  getTasksByStatus(status: String) {
    return this.tasks.filter((t) => t.status === status);
  }

  onDragStart(event: DragEvent, task: Task) {
    event.dataTransfer?.setData('text', task.id.toString());
    (event.target as HTMLElement).classList.add('dragging');
  }

  onDrop(event: DragEvent, status: String) {
    event.preventDefault();
    const taskId = Number(event.dataTransfer?.getData('text'));
    const task = this.tasks.find((t) => t.id === taskId);

    if (task) {
      task.status = status as TaskStatus;
    }

    const draggingEl = document.querySelector('.dragging');
    if (draggingEl) {
      draggingEl.classList.remove('dragging');
    }
  }

  onDragEnd(event: DragEvent) {
    (event.target as HTMLElement).classList.remove('dragging');
  }
}
