export interface User {
  id?:string,
  username: string;
  password: string;
  email: string;
  role?: string;
}

export interface LoginUser {
  email: string;
  password: string;
}
