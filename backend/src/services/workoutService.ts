import { db } from "../shared/db";
import { INewWorkout, IWorkout, INewMove } from "../types/interfaces";
import camelcaseKeys = require("camelcase-keys");

export const getWorkoutsByUserId = async (
  userId: number
): Promise<IWorkout[] | undefined> => {
  const result = await db.query(`SELECT * FROM workout WHERE user_id = $1;`, [
    userId
  ]);

  if (result.rowCount === 0) {
    return undefined;
  }

  const ret = camelcaseKeys(result.rows) as unknown;

  return ret as IWorkout[];
};

export const getWorkoutById = async (
  userId: number,
  workoutId: number
): Promise<IWorkout | undefined> => {
  const result = await db.query(
    `SELECT * FROM workout WHERE id = $1 AND user_id = $2;`,
    [userId, workoutId]
  );

  if (result.rowCount === 0) {
    return undefined;
  }

  const ret = camelcaseKeys(result.rows[0]) as unknown;

  return ret as IWorkout;
};

export const createWorkout = async (
  move: INewWorkout
): Promise<IWorkout | undefined> => {
  const { userId, name, info } = move;

  const result = await db.query(
    `
    INSERT INTO workout (user_id, name, info, created_at)
    VALUES ($1, $2, $3, NOW()) RETURNING *;
  `,
    [userId, name, info]
  );

  if (result.rowCount === 0) {
    return undefined;
  }

  const ret = camelcaseKeys(result.rows)[0] as unknown;

  return ret as IWorkout;
};

export const deleteWorkout = (workoutId: number): Promise<undefined> => {
  return new Promise(async (resolve, reject) => {
    const result = await db.query(`DELETE FROM move WHERE id = $1;`, [
      workoutId
    ]);

    if (result.rowCount === 0) {
      reject(new Error("Invalid Workout ID"));
    }

    resolve();
  });
};
