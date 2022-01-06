//@ts-check
import * as sqlite from "sqlite";

/**x
 * A user
 * @typedef {{
 * "id": number,
 * "fullname": string,
 * "username": string,
 * "email": string,
 * "password": string,
 * "picture_src": string,
 * "role": string,
 *  }} user
 */

/**
 * Returns permissions from user in array.
 * @param {sqlite.Database} db
 * @param {String} role
 * =>
 * @returns {Promise<[]>}
 */
export async function getPermissions(db, role) {
  const sql = `SELECT permissions FROM roles WHERE role=$role`;

  let result = await db.get(sql, { $role: role });
  return result.permissions.split(",");
}
