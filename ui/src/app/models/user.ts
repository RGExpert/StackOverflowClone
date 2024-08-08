import {Role} from "./role";

export interface User {
  userId?: number;
  userName: string;
  password: string;
  joinDate: string
  role: Role;
  score?: number;
  banned?: number;
  email?:string;
}
