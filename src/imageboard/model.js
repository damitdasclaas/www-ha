//@ts-check
import * as sqlite from "sqlite";
import Debug from "debug";
const debug = Debug("user:model");

/**
 * Returns all user as array sorted by user_id.
 * @param {sqlite.Database} db
 * =>
 * @returns {Promise<[]>}
 */
export async function all(db) {
  const sql = `SELECT * FROM user ORDER BY user_id`;

  return await db.all(sql);
}
