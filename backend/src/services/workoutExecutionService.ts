import { db } from "src/shared/db";
import camelcaseKeys = require("camelcase-keys");
import { IWorkoutExecution, INewWorkoutExecution } from "src/types/interfaces";

export const createWorkoutExecution = async ({
  workoutId,
  info
}: INewWorkoutExecution): Promise<IWorkoutExecution | undefined> => {
  const result = await db.query(
    `INSERT INTO workout_executions (workout_id, info, created_at)
     VALUES ($1, $2 ,NOW()) RETURNING *;`,
    [workoutId, info ? info : ""]
  );

  if (result.rowCount === 0) {
    return undefined;
  }

  const ret = camelcaseKeys(result.rows)[0] as unknown;

  return ret as IWorkoutExecution;
};
