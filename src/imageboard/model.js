//@ts-check
import * as sqlite from "sqlite";
import fs from "fs";

import Debug from "debug";
const debug = Debug("user:model");

/**x
 * An image
 * @typedef {{
 * "id": number,
 * "src": string,
 * "author": string,
 * "date_uploaded": string,
 *  }} image
 */

/**x
 * A comment
 * @typedef {{
 * "id": number,
 * "image_id": number,
 * "author": string,
 * "text": string,
 * "date_uploaded": string,
 *  }} comment
 */

/**
 * Returns all images as array sorted by date_uploaded.
 * @param {sqlite.Database} db
 * =>
 * @returns {Promise<[]>}
 */
export async function getAllImages(db) {
  const sql = `SELECT * FROM image ORDER BY date_uploaded DESC`;

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
  const sql = `SELECT * FROM comment WHERE image_id=$id ORDER BY date_uploaded DESC`;

  return await db.all(sql, { $id: id });
}

/**
 * Returns image with given id.
 * @param {sqlite.Database} db
 * @param {number} id
 * =>
 * @returns {Promise<image>}
 */
export async function getSingleImage(db, id) {
  const sql = `SELECT * FROM image WHERE id=$id`;

  return await db.get(sql, { $id: id });
}

/**
 * Adds Image with fileName.
 * @param {sqlite.Database} db
 * @param {String} fileName
 * =>
 *
 */
export async function addImage(db, fileName) {
  const sql = `INSERT INTO image (src, author, date_uploaded) 
  VALUES ($src, $author, $date_uploaded)`;

  await db.run(sql, {
    $src: fileName,
    $author: "New Author",
    $date_uploaded: new Date().toISOString(),
  });
}

/**
 * Adds Image with fileName.
 * @param {sqlite.Database} db
 * @param {number} id
 * @param {comment} comment
 * =>
 *
 */
export async function addComment(db, id, comment) {
  const sql = `INSERT INTO comment (image_id, author, text, date_uploaded) 
  VALUES ($image_id, $author, $text, $date_uploaded)`;

  await db.run(sql, {
    $image_id: id,
    $author: comment.author,
    $text: comment.text,
    $date_uploaded: new Date().toISOString(),
  });
}

/**
 * Deletes an image from the database and folder.
 * @param {sqlite.Database} db
 * @param {number} id
 * =>
 * @returns {Promise<number>}
 */
export async function deleteImageById(db, id) {
  const imageData = await getSingleImage(db, id);

  if (imageData != undefined) {
    fs.unlinkSync(process.cwd() + "/web/images/uploads/" + imageData.src);
  }

  if (id != undefined) {
    const sql = `DELETE FROM image WHERE id=$id`;

    const result = await db.run(sql, { $id: id });
    return result.changes;
  }
}

/**
 * Deletes all comments from an image from the database.
 * @param {sqlite.Database} db
 * @param {number} id
 * =>
 * @returns {Promise<number>}
 */
export async function deleteCommentsByImage(db, id) {
  if (id != undefined) {
    const sql = `DELETE FROM comment WHERE image_id=$id`;

    const result = await db.run(sql, { $id: id });
    return result.changes;
  }
}

/**
 * Deletes all comments from an image from the database.
 * @param {sqlite.Database} db
 * @param {number} id
 * =>
 * @returns {Promise<number>}
 */
export async function deleteSingleComment(db, id) {
  if (id != undefined) {
    const sql = `DELETE FROM comment WHERE id=$id`;

    const result = await db.run(sql, { $id: id });
    return result.changes;
  }
}
