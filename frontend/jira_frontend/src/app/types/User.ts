export interface NewUser {
    username?: string;
    password?: string;
    email?: string;
    role?: string;
}
export interface User extends NewUser{
    id :number;
}