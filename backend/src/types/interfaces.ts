import { Role, Vibe } from "./enums";

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
  moves: IMove[];
  createdAt: string;
}

export interface INewWorkout {
  userId: number;
  name: string;
  info: string;
  moves: string[];
}

export type IMoveIdList = string[];

export interface IMove {
  id: number;
  userId: number;
  name: string;
  info: string;
  createdAt: string;
}

export interface INewMove {
  userId: number;
  name: string;
  info: string;
}

export interface IWorkoutMove {
  workoutId: number;
  moveId: number;
  addedAt: string;
}

export interface INewWorkoutMove {
  workoutId: number;
  moveId: number;
}

export interface INewWorkoutExecution {
  workoutId: string;
  info?: string;
}

export interface IWorkoutExecution {
  workoutId: string;
  info?: string;
  createdAt: string;
  endedAt: string;
}

export interface INewMoveExecution {
  workoutExecutionId: string;
  moveId: string;
  sets: number;
  reps: number;
  weight: number;
  vibe: Vibe;
  restingTime: number;
  info: string;
}
"";
