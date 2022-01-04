//@ts-check
import * as sqlite from "sqlite";

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
 * Adds Comment to Image.
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
 * Deletes a single comment from an image from the database.
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
