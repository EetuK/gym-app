import { INewMove, IMove } from "../types/interfaces";
import { db } from "../shared/db";
import camelCaseKeys from "camelcase-keys";
import camelcaseKeys from "camelcase-keys";

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

export const getMoveById = async (
  userId: number,
  moveId: number
): Promise<IMove | undefined> => {
  const result = await db.query(
    `SELECT * FROM move WHERE id = $1 AND user_id = $2;`,
    [moveId, userId]
  );

  if (result.rowCount === 0) {
    //reject(new Error("No Moves found"));
    return undefined;
  }

  const ret = camelCaseKeys(result.rows[0]) as unknown;

  return ret as IMove;
};

export const createMove = async (
  move: INewMove
): Promise<IMove | undefined> => {
  const { userId, name, info } = move;

  const editedInfo = info ? info : "";

  const result = await db.query(
    `
    INSERT INTO move (user_id, name, info, created_at)
    VALUES ($1, $2, $3,  NOW())
    RETURNING *;
  `,
    [userId, name, editedInfo]
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

export const updateMove = async (
  moveId: string,
  name: string,
  info?: string
): Promise<IMove | undefined> => {
  const moveInfo = info ? info : "";

  const result = await db.query(
    `
    UPDATE move SET
      name = $1,
      info = $2
    WHERE id = $3 RETURNING *;`,
    [name, moveInfo, moveId]
  );

  if (result.rows.length === 0) {
    return undefined;
  }

  const move = (camelcaseKeys(result.rows) as unknown) as IMove;
};
