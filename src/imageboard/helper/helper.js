import { promisify } from "util";
import { randomBytes } from "crypto";

const randomBytesAsync = promisify(randomBytes);

export const generateToken = async () => {
  return Buffer.from(await randomBytesAsync(32)).toString("base64");
};

export async function getFileName(filePath) {
  if (filePath.includes("/")) {
    const temp = filePath.split("/");
    return temp[temp.length - 1];
  } else {
    const temp = filePath.split("\\");
    return temp[temp.length - 1];
  }
}

export function checkPermission(user, permission) {
  return user.permissions.includes(permission);
}

export async function validateLoginForm(loginData) {
  return {
    username: validateUsername(loginData.username),
    password: validatePassword(loginData.password),
  };
}

export function containsText(string) {
  return typeof string == "string" && string.length >= 3;
}

export function validateUsername(username) {
  return !containsText(username) ? "Bitte einen Username eingeben." : undefined;
}

export function validatePassword(password) {
  return !containsText(password) ? "Bitte ein Passwort eingeben." : undefined;
}

// password auf sicherheit prüfen
// ISO String aufbereitungs function machen
