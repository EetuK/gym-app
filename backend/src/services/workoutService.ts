import { db } from "../shared/db";
import { INewWorkout } from "../types/interfaces";

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
