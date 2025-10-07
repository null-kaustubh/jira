import { User } from './User';

export interface Project {
  name: string;
  description: string;
}

export interface ProjectFull {
  projectId: number;
  name: string;
  description?: string;
  createdAt: Date;
  createdBy: string;
  manager: User;
  status: string;
}

export interface UpdateProject {
  name: string;
  description?: string;
  manager: User;
  status: string;
}
