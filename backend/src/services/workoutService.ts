import { db } from "../shared/db";
import {
  INewWorkout,
  IWorkout,
  INewMove,
  IMove,
  IUpdateMoveExecution,
  IUpdateWorkout
} from "../types/interfaces";
import camelcaseKeys = require("camelcase-keys");

export const getWorkoutsByUserId = async (
  userId: number
): Promise<IWorkout[] | undefined> => {
  const workoutResult = await db.query(
    `SELECT * FROM workout WHERE user_id = $1;`,
    [userId]
  );

  if (workoutResult.rowCount === 0) {
    return undefined;
  }

  const workouts = (camelcaseKeys(workoutResult.rows) as unknown) as IWorkout[];

  return workouts;
};

export const getWorkoutById = async (
  userId: string,
  workoutId: string
): Promise<IWorkout | undefined> => {
  const workoutResult = await db.query(
    `SELECT * FROM workout WHERE id = $1 AND user_id = $2;`,
    [workoutId, userId]
  );

  if (workoutResult.rowCount === 0) {
    return undefined;
  }

  let workout = (camelcaseKeys(workoutResult.rows[0]) as unknown) as IWorkout;

  console.log(workout);

  const moveResult = await db.query(
    `
  SELECT workout_moves.workout_id, move.* FROM workout_moves
    LEFT JOIN move ON move.id = workout_moves.move_id
  WHERE workout_moves.workout_id = $1`,
    [workoutId]
  );

  console.log(moveResult);

  const moves = (camelcaseKeys(moveResult.rows) as unknown) as IMove[];

  console.log(moves);

  workout.moves = moves;
  return workout;
};

export const createWorkout = async (
  params: INewWorkout
): Promise<IWorkout | undefined> => {
  const { userId, name, info, moves } = params;

  const resultWorkout = await db.query(
    `
    INSERT INTO workout (user_id, name, info, created_at)
    VALUES ($1, $2, $3, NOW()) RETURNING *;
  `,
    [userId, name, info]
  );

  let workout = (camelcaseKeys(resultWorkout.rows)[0] as unknown) as IWorkout;

  const moveInsertQuery = `
    INSERT INTO workout_moves (workout_id, move_id, added_at) 
    VALUES ${moves
      .map(move => `(${workout.id}, ${String(move)}, NOW())`)
      .join(",")};`;

  await db.query(moveInsertQuery);

  const resultMoves = await db.query(
    `
  SELECT workout_moves.workout_id, move.* FROM workout_moves
    LEFT JOIN move ON move.id = workout_moves.move_id
  WHERE workout_moves.workout_id = $1`,
    [workout.id]
  );

  workout.moves = (camelcaseKeys(resultMoves.rows) as unknown) as IMove[];

  return workout as IWorkout;
};

export const deleteWorkout = async (workoutId: number): Promise<void> => {
  let result = await db.query(
    `
      DELETE FROM workout_moves WHERE workout_id = $1;
      `,
    [workoutId]
  );

  result = await db.query(
    `
    DELETE FROM workout WHERE id = $1;
    `,
    [workoutId]
  );

  if (result.rowCount === 0) {
    throw new Error("Invalid Workout ID");
  }
};

export const updateWorkout = async (
  workoutId: string,
  userId: string,
  { name, info }: IUpdateWorkout
): Promise<IWorkout | undefined> => {
  await db.query(
    `
      UPDATE workout SET 
        name = $1,
        info = $2
      WHERE id = $3;
      `,
    [name, info, workoutId]
  );

  const result = await getWorkoutById(userId, workoutId);

  return result;
};
