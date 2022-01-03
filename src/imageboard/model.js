//@ts-check
import * as sqlite from "sqlite";
import Debug from "debug";
const debug = Debug("user:model");

/**
 * Returns all images as array sorted by date_uploaded.
 * @param {sqlite.Database} db
 * =>
 * @returns {Promise<[]>}
 */
export async function getAllImages(db) {
  const sql = `SELECT * FROM image ORDER BY date_uploaded`;

  return await db.all(sql);
}

/**
 * Returns all comments from specific image with id as array sorted by date_uploaded.
 * @param {sqlite.Database} db
 * @param {number} id
 * =>
 * @returns {Promise<[]>}
 */
export async function getComments(db, id) {
  const sql = `SELECT * FROM comment WHERE image_id=$id ORDER BY date_uploaded`;

  return await db.all(sql, { $id: id });
}

/**
 * Returns image with given id.
 * @param {sqlite.Database} db
 * @param {number} id
 * =>
 * @returns {Promise<[]>}
 */
export async function getSingleImage(db, id) {
  const sql = `SELECT * FROM image WHERE id=$id`;

  return await db.get(sql, { $id: id });
}
