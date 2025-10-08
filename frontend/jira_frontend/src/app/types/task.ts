export interface Task {
  id: number;
  title: String;
  priority? : TaskPriority;
  status: TaskStatus;
  description: String;
  assignee: String;
  created_at? : Date;
  due_date?: Date;
 
}
 
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
 
export type TaskStatus = 'TO DO' | 'IN PROGRESS' | 'IN REVIEW' | 'DONE';