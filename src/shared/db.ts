import { Pool } from "pg";
import { addUser, getUserByEmail } from "../services/userService";
import { Role } from "src/types/enums";
import camelcaseKeys = require("camelcase-keys");

export const db = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING
});

export const initDb = async () => {
  await db.connect();
};
