export interface User {
  user_id:string,
  username: string;
  password: string;
  email: string;
  role?: string;
}

export interface LoginUser {
  email: string;
  password: string;
}
