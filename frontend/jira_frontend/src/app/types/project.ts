import { User } from "./authInterface";

export interface Project {
  name: string;
  description: string;
}

export interface ProjectFull {
  tasks: any;
  projectId: number;
  name: string;
  description?: string;
  createdAt: Date;
  createdBy: string;
  manager: User;
  status: string;
  employees? : User[]
}

export interface UpdateProject {
  name: string;
  description?: string;
  manager: User;
  status: string;
  employeeIds? : number[]; 
}
