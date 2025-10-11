export interface TaskAssignee {
  user_id: number;
  username?: string; 
  email?: string; 
}

export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskType = 'BUG' | 'FEATURE' | 'REFACTOR' | 'TESTING';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: String;
  description: String;
  status: TaskStatus;
  type: TaskType;
  priority: TaskPriority;
  assignee: TaskAssignee;
  dueDate: Date | undefined;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  assignee: {
    user_id: number | null;
  };
}