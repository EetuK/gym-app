import { INewMove, IMove } from "../types/interfaces";
import { db } from "../shared/db";
import snakeCaseKeys from "snakecase-keys";
import camelCaseKeys from "camelcase-keys";

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

  if (result.rows.length === 0) {
    return undefined;
  }

  const ret = camelCaseKeys(result.rows)[0] as unknown;

  return ret as IMove;
};

export const getMovesByUserId = async (
  userId: number
): Promise<IMove[] | undefined> => {
  const result = await db.query(
    `
  SELECT * FROM move WHERE user_id = $1;
  `,
    [userId]
  );

  if (result.rows.length === 0) {
    return undefined;
  }

  const ret = camelCaseKeys(result.rows) as unknown;

  return ret as IMove[];
};
