import { IUser } from "../types/interfaces";
import { db } from "../shared/db";
import snakeCaseKeys from "snakecase-keys";
import camelCaseKeys from "camelcase-keys";

export const addUser = async (user: IUser) => {
  const { firstname, lastname, email, passwordHash, role } = user;

  return db.query(
    `
    INSERT INTO user_account (firstname, lastname, email, password_hash, role, created_at, edited_at)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW());
  `,
    [firstname, lastname, email, passwordHash, role]
  );
};

export const getUserByEmail = async (
  email: string
): Promise<IUser | undefined> => {
  const result = await db.query(
    `
  SELECT * FROM user_account WHERE email = $1;
  `,
    [email]
  );

  if (result.rows.length === 0) {
    return undefined;
  }

  const ret = camelCaseKeys(result.rows)[0] as unknown;

  return ret as IUser;
};

export const getUserById = async (id: string): Promise<IUser | undefined> => {
  const result = await db.query(
    `
  SELECT id,firstname, lastname, email, role FROM user_account WHERE id = $1;
  `,
    [id]
  );

  if (result.rows.length === 0) {
    return undefined;
  }

  const ret = camelCaseKeys(result.rows)[0] as unknown;

  return ret as IUser;
};
