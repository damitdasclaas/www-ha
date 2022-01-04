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
  const sql = `INSERT INTO user (fullname, username, email, password_hash, picture_src) 
      VALUES ($fullname, $username, $email, $password_hash, $picture_src)`;

  await db.run(sql, {
    $fullname: user.fullname,
    $username: user.username,
    $email: user.email,
    $password_hash: await argon2.hash(user.password),
    $picture_src: "default_profile_picture.png",
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
 * Edits profile picture from user.
 * @param {sqlite.Database} db
 * @param {String} username
 * @param {String} fileName
 * =>
 *
 */
export async function editProfilePicture(db, username, fileName) {
  const userData = await getUser(db, username);

  if (userData.picture_src != undefined) {
    fs.unlinkSync(
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
 * Validates password from login.
 * @param {sqlite.Database} db
 * @param {String} username
 * @param {String} password
 * =>
 * @returns {Promise<boolean>}
 */
export async function validatePassword(db, username, password) {
  const user = await getUser(db, username);
  return await argon2.verify(user.password_hash, password);
}
