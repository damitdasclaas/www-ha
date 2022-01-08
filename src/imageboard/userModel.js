import fs from "fs";
import * as sqlite from "sqlite";
import argon2 from "argon2";

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
 * Adds User to database.
 * @param {sqlite.Database} db
 * @param {user} user
 * =>
 *
 */
export async function addUser(db, user) {
  const sql = `INSERT INTO user (fullname, username, email, password_hash, picture_src, role) 
      VALUES ($fullname, $username, $email, $password_hash, $picture_src, $role)`;

  await db.run(sql, {
    $fullname: user.fullname,
    $username: user.username,
    $email: user.email,
    $password_hash: await argon2.hash(user.password),
    $picture_src: "default_profile_picture.png",
    $role: "user",
  });
}

/**
 * Edits userdata in database.
 * @param {sqlite.Database} db
 * @param {user} user
 * @param {String} username
 * =>
 *
 */
export async function editUser(db, user, username) {
  const sql = `UPDATE user
    SET fullname = $fullname, email = $email
    WHERE username=$username`;

  await db.run(sql, {
    $fullname: user.fullname,
    $email: user.email,
    $username: username,
  });
}

/**
 * Edits user role in database.
 * @param {sqlite.Database} db
 * @param {String} username
 * @param {String} role
 * =>
 *
 */
export async function editUserRole(db, username, role) {
  const sql = `UPDATE user
    SET role = $role WHERE username=$username`;

  await db.run(sql, {
    $role: role,
    $username: username,
  });
}

/**
 * Deletes user in database.
 * @param {sqlite.Database} db
 * @param {String} username
 * =>
 *
 */
export async function deleteUser(db, username) {
  const sql = `DELETE FROM user WHERE username=$username`;

  const result = await db.run(sql, { $username: username });
  return result.changes;
}

/**
 * Edits profile picture from user.
 * @param {sqlite.Database} db
 * @param {String} username
 * @param {String} fileName
 * =>
 *
 */
export async function editProfilePicture(db, username, fileName) {
  const userData = await getUser(db, username);

  if (userData.picture_src != "default_profile_picture.png") {
    await deleteFile(
      process.cwd() + "/web/images/profile_pictures/" + userData.picture_src
    );
  }

  const sql = `UPDATE user
    SET picture_src = $picture_src
    WHERE username=$username`;

  await db.run(sql, {
    $picture_src: fileName,
    $username: username,
  });
}

/**
 * Deletes profile picture from user.
 * @param {sqlite.Database} db
 * @param {String} username
 * =>
 */
export async function deleteProfilePicture(db, username) {
  const userData = await getUser(db, username);

  if (userData.picture_src != "default_profile_picture.png") {
    await deleteFile(
      process.cwd() + "/web/images/profile_pictures/" + userData.picture_src
    );
  }
}

/**
 * Returns user with given username.
 * @param {sqlite.Database} db
 * @param {String} username
 * =>
 * @returns {Promise<user>}
 */
export async function getUser(db, username) {
  const sql = `SELECT * FROM user WHERE username=$username`;

  return await db.get(sql, { $username: username });
}

/**
 * Returns all users as array sorted by username.
 * @param {sqlite.Database} db
 * =>
 * @returns {Promise<[]]>}
 */
export async function getAllUser(db) {
  const sql = `SELECT * FROM user ORDER BY username`;

  return await db.all(sql);
}

/**
 * Validates password from login.
 * @param {user} user
 * @param {String} formPassword
 * =>
 * @returns {Promise<boolean>}
 */
export async function validatePassword(user, formPassword) {
  return await argon2.verify(user.password_hash, formPassword);
}

/**
 * Deletes an image from the folder.
 * @param {string} path
 * =>
 */
export async function deleteFile(path) {
  fs.unlinkSync(path);
}
