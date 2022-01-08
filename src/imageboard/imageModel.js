//@ts-check
import * as sqlite from "sqlite";
import fs from "fs";

/**x
 * An image
 * @typedef {{
 * "id": number,
 * "src": string,
 * "author": string,
 * "date_uploaded": string,
 *  }} image
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
 * @param {String} username
 * =>
 *
 */
export async function addImage(db, fileName, username) {
  const sql = `INSERT INTO image (src, author, date_uploaded) 
  VALUES ($src, $author, $date_uploaded)`;

  await db.run(sql, {
    $src: fileName,
    $author: username,
    $date_uploaded: new Date().toISOString(),
  });
}

/**
 * Deletes an image from the database and folder.
 * @param {sqlite.Database} db
 * @param {number} id
 * =>
 */
export async function deleteImageById(db, id) {
  const imageData = await getSingleImage(db, id);

  if (imageData != undefined) {
    fs.unlinkSync(process.cwd() + "/web/images/uploads/" + imageData.src);
  }

  const sql = `DELETE FROM image WHERE id=$id`;

  await db.run(sql, { $id: id });
}

/**
 * Deletes an image from the database and folder.
 * @param {sqlite.Database} db
 * @param {String} username
 * =>
 */
export async function deleteImagesByUser(db, username) {
  if (username != undefined) {
    let sql = `SELECT * FROM image WHERE author=$username`;

    const imageData = await db.all(sql, { $username: username });

    imageData.map((image) =>
      deleteFile(process.cwd() + "/web/images/uploads/" + image.src)
    );

    sql = `DELETE FROM image WHERE author=$username`;

    await db.run(sql, { $username: username });
  }
}

/**
 * Deletes an image from the folder.
 * @param {string} path
 * =>
 */
export async function deleteFile(path) {
  fs.unlinkSync(path);
}
