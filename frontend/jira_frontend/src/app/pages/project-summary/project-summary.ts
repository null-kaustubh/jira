import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';
import { ProjectService } from 'src/app/services/project-service';
import { TaskService } from 'src/app/services/taskService';
import { Task } from 'src/app/types/task';
Chart.register(...registerables);

@Component({
  selector: 'app-project-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-summary.html',
  styleUrl: './project-summary.css',
})
export class ProjectSummary implements OnInit {
  projectId!: number;
  projectName: string = '';
  stats: any = {};
  isLoading = true;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  fetchProjectData(projectId: number) {
    this.isLoading = true;
    forkJoin({
      project: this.projectService.getProjectById(projectId),
      tasks: this.taskService.getTasksByProjectId(projectId),
    }).subscribe(({ project, tasks }) => {
      // set project name
      this.projectName = project.name;
      this.isLoading = false;
      // derive counts
      const todo = tasks.filter((t) => t.status === 'TO_DO').length;
      const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
      const inReview = tasks.filter((t) => t.status === 'IN_REVIEW').length;
      const completed = tasks.filter((t) => t.status === 'DONE').length;

      this.stats = {
        total: tasks.length,
        todo,
        inProgress,
        inreview: inReview,
        completed,
      };

      // render after both responses arrive
      this.renderTaskChart();
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.projectId = id;
        this.fetchProjectData(id);
      }
    });
  }

  onProjectChange(event: any) {
    const projectId = Number(event.target.value);
    this.fetchProjectData(projectId);
  }

  renderTaskChart() {
    const existingChart = Chart.getChart('taskChart');
    if (existingChart) existingChart.destroy();

    new Chart('taskChart', {
      type: 'doughnut',
      data: {
        labels: ['To do', 'In Progress', 'In Review', 'Completed'],
        datasets: [
          {
            label: 'Tasks',
            data: [
              this.stats.todo,
              this.stats.inProgress,
              this.stats.inreview,
              this.stats.completed,
            ],
            backgroundColor: ['#facc15', '#3b82f6', '#F59E0B', '#22c55e'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 14, // smaller color box
              padding: 20, // spacing between labels
              usePointStyle: true, // makes it look cleaner
            },
            align: 'center', // force them to be in one row
          },
          title: {
            display: true,
            text: `${this.projectName} Task Breakdown`,
            font: { size: 18 },
          },
        },
        layout: {
          padding: 10,
        },
      },
    });
  }
}
