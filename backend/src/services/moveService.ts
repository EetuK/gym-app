import { INewMove, IMove } from "../types/interfaces";
import { db } from "../shared/db";
import camelCaseKeys from "camelcase-keys";

export const getMovesByUserId = async (
  userId: number
): Promise<IMove[] | undefined> => {
  const result = await db.query(
    `
  SELECT * FROM move WHERE user_id = $1;
  `,
    [userId]
  );

  if (result.rowCount === 0) {
    return undefined;
  }

  const ret = camelCaseKeys(result.rows) as unknown;

  return ret as IMove[];
};

export const getMoveById = (
  userId: number,
  moveId: number
): Promise<undefined> => {
  return new Promise(async (resolve, reject) => {
    const result = await db.query(
      `SELECT * FROM move WHERE id = $1 AND user_id = $2;`,
      [moveId, userId]
    );

    if (result.rowCount === 0) {
      reject(new Error("No Moves found"));
    }

    resolve(result.rows[0]);
  });
};

export const createMove = async (
  move: INewMove
): Promise<IMove | undefined> => {
  const { userId, name, info } = move;

  const result = await db.query(
    `
    INSERT INTO move (user_id, name, info, created_at)
    VALUES ($1, $2, $3,  NOW())
    RETURNING *;
  `,
    [userId, name, info]
  );

  if (result.rowCount === 0) {
    return undefined;
  }

  const ret = camelCaseKeys(result.rows)[0] as unknown;

  return ret as IMove;
};

export const deleteMove = (moveId: number): Promise<undefined> => {
  return new Promise(async (resolve, reject) => {
    const result = await db.query(`DELETE FROM move WHERE id = $1;`, [moveId]);

    if (result.rowCount === 0) {
      reject(new Error("Invalid Move ID"));
    }

    resolve();
  });
};
