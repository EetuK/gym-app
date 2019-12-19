import { Client } from "pg";
import { addUser, getUserByEmail } from "../services/userService";
import { Role } from "src/types/enums";

export const db = new Client({
  connectionString: process.env.PG_CONNECTION_STRING
});

export const initDb = async () => {
  await db.connect();
};
