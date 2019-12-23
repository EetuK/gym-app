import { db } from "src/shared/db";
import camelcaseKeys = require("camelcase-keys");
import {
  IWorkoutExecution,
  INewMoveExecution,
  IUpdateMoveExecution
} from "src/types/interfaces";

export const createMoveExecution = async (
  params: INewMoveExecution
): Promise<IWorkoutExecution | undefined> => {
  const {
    workoutExecutionId,
    moveId,
    sets,
    reps,
    weight,
    vibe,
    restingTime,
    info
  } = params;

  const result = await db.query(
    `INSERT INTO move_execution (
        workout_execution_id, 
        move_id, 
        sets,
        reps,
        weight,
        vibe,
        resting_time,
        info,
        created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ,NOW()) RETURNING *;`,
    [workoutExecutionId, moveId, sets, reps, weight, vibe, restingTime, info]
  );

  if (result.rowCount === 0) {
    return undefined;
  }

  const ret = camelcaseKeys(result.rows)[0] as unknown;

  return ret as IWorkoutExecution;
};

export const updateMoveExecutionById = async (
  id: string,
  params: IUpdateMoveExecution
): Promise<IWorkoutExecution | undefined> => {
  const { sets, reps, weight, vibe, restingTime, info } = params;

  const result = await db.query(
    `UPDATE move_execution SET 
        sets = $1,
        reps = $2,
        weight = $3,
        vibe = $4,
        resting_time = $5,
        info = $6 
    WHERE id = $7
    RETURNING *;`,
    [sets, reps, weight, vibe, restingTime, info, id]
  );

  if (result.rowCount === 0) {
    return undefined;
  }

  const ret = camelcaseKeys(result.rows)[0] as unknown;

  return ret as IWorkoutExecution;
};

export const deleteMoveExecutionById = async (id: string): Promise<void> => {
  try {
    await db.query(`DELETE FROM move_execution WHERE id = $1`, [id]);
  } catch (err) {
    throw new Error("Error ocurred!");
  }
};
