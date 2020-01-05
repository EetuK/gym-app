import { db } from "../shared/db";
import camelcaseKeys = require("camelcase-keys");
import { IWorkoutMove, INewWorkoutMove, IMove } from "../types/interfaces";

export const getWorkoutMoves = async (
  workoutId: number
): Promise<IWorkoutMove[] | undefined> => {
  const result = await db.query(
    `SELECT * FROM workout_moves WHERE workout_id = $1;`,
    [workoutId]
  );

  if (result.rowCount === 0) {
    return undefined;
  }

  const ret = camelcaseKeys(result.rows) as unknown;

  return ret as IWorkoutMove[];
};

export const createWorkoutMove = async (
  workoutMove: INewWorkoutMove
): Promise<IWorkoutMove | undefined> => {
  const { workoutId, moveId } = workoutMove;

  const result = await db.query(
    `INSERT INTO workout_moves (workout_id, move_id, added_at) VALUES ($1, $2, NOW()) RETURNING *;`,
    [workoutId, moveId]
  );

  if (result.rowCount === 0) {
    return undefined;
  }

  const ret = camelcaseKeys(result.rows)[0] as unknown;

  return ret as IWorkoutMove;
};

export const deleteWorkoutMove = (
  workoutId: number,
  moveId: number
): Promise<undefined> => {
  return new Promise(async (resolve, reject) => {
    const result = await db.query(
      `DELETE FROM workout_moves WHERE workout_id = $1 AND move_id = $2;`,
      [workoutId, moveId]
    );

    if (result.rowCount === 0) {
      reject(new Error("Invalid WorkoutMove ID"));
    }

    resolve();
  });
};
