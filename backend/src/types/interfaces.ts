import { Role } from "./enums";

export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  passwordHash: string;
  role: Role;
}

export interface INewUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: Role;
}

export interface IWorkout {
  id: number;
  userId: number;
  name: string;
  info: string;
  createdAt: string;
}

export interface INewWorkout {
  userId: number;
  name: string;
  info: string;
}

export interface INewMove {
  userId: number;
  name: string;
  info: string;
}

export interface IMove {
  id: number;
  userId: number;
  name: string;
  info: string;
  createdAt: string;
}
