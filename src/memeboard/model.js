//@ts-check
import * as sqlite from "sqlite";
import Debug from "debug";
const debug = Debug("bookmark:model");

/**x
 * A bookmark
 * @typedef {{
 * "id": number,
 * "uri": string,
 * "title": string,
 * "description": string,
 * "tags": string,
 * "date_created": string,
 *  }} bookmark
 */

/**
 * Returns all bookmarks as array sorted by date.
 * @param {sqlite.Database} db
 * =>
 * @returns {Promise<bookmark[]>}
 */
export async function all(db) {
  const sql = `SELECT * FROM bookmarks ORDER BY date_created DESC`;

  return await db.all(sql);
}
