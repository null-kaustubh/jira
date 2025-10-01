export interface User {
  username: string;
  password: string;
  email: string;
  role?: string;
}

export interface LoginUser {
  email: string;
  password: string;
}
