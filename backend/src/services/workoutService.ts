import { db } from "../shared/db";
import { INewWorkout, IWorkout } from "../types/interfaces";
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

export const addWorkout = async (workout: INewWorkout) => {
  const { userId, name, info } = workout;

  return db.query(
    `
    INSERT INTO workout (userId, name, info, created_at)
    VALUES ($1, $2, $3, NOW());
  `,
    [userId, name, info]
  );
};
