import { db } from "src/shared/db";
import camelcaseKeys = require("camelcase-keys");
import { IWorkoutExecution, INewMoveExecution } from "src/types/interfaces";

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
    `INSERT INTO workout_executions (
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
