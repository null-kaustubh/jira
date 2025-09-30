export interface Task {
  id: number;
  title: String;
  status: TaskStatus;
  description: String;
  assignee: String;
}

export type TaskStatus = 'TO DO' | 'IN PROGRESS' | 'IN REVIEW' | 'DONE';
