import { db } from "../shared/db";
import camelcaseKeys = require("camelcase-keys");
import {
  IWorkoutExecution,
  INewWorkoutExecution,
  IExtendedWorkoutExecution,
  IExtendedMoveExecution
} from "../types/interfaces";

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

export const getWorkoutExecutionsByWorkoutId = async (
  workoutId: string
): Promise<IWorkoutExecution[] | undefined> => {
  const result = await db.query(
    `SELECT * FROM workout_executions WHERE workout_id = $1;`,
    [workoutId]
  );

  if (result.rowCount === 0) {
    return [];
  }

  const ret = camelcaseKeys(result.rows) as unknown;

  return ret as IWorkoutExecution[];
};

export const getWorkoutExecutionById = async (
  id: string
): Promise<IWorkoutExecution | undefined> => {
  const result = await db.query(
    `SELECT * FROM workout_executions 
    WHERE workout_executions.id = $1`,
    [id]
  );

  if (result.rowCount === 0) {
    return undefined;
  }

  let workoutExecution = (camelcaseKeys(
    result.rows[0]
  ) as unknown) as IExtendedWorkoutExecution;

  const resultMoveExecution = await db.query(
    `SELECT move.*, move_execution.* FROM move_execution
      LEFT JOIN move ON move.id = move_execution.move_id
    WHERE workout_execution_id = $1`,
    [id]
  );

  const moveExecution = (camelcaseKeys(
    resultMoveExecution.rows
  ) as unknown) as IExtendedMoveExecution[];

  workoutExecution.executedMoves = moveExecution;

  return workoutExecution as IExtendedWorkoutExecution;
};

export const deleteWorkoutExecutionById = async (
  workoutExecutionId: string
): Promise<void> => {
  try {
    await db.query(
      `DELETE FROM move_execution WHERE workout_execution_id = $1`,
      [workoutExecutionId]
    );
    await db.query(`DELETE FROM  workout_executions WHERE id = $1`, [
      workoutExecutionId
    ]);
  } catch (err) {
    throw new Error("Error ocurred!");
  }
};
