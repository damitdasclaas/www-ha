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

export function checkAdmin(user) {
  return user.role == "admin";
}

export async function validateLoginForm(loginData) {
  return {
    username: validateUsername(loginData.username),
    password: validatePassword(loginData.password),
  };
}

export async function validateCommentForm(comment) {
  return {
    comment: validateComment(comment),
  };
}

export async function validateCreateForm(formData) {
  return {
    username: validateUsername(formData.username),
    password: validateCreatePassword(formData.password),
  };
}

export async function validateUploadFile(fileType) {
  return {
    fileType: validateFileType(fileType),
  };
}

export function containsText(string) {
  return typeof string == "string" && string.length >= 3;
}

export function containsSecurePassword(string) {
  return typeof string == "string" && string.length >= 7;
}

export function validateUsername(username) {
  return !containsText(username) ? "Bitte einen Username eingeben." : undefined;
}

export function validatePassword(password) {
  return !containsText(password) ? "Bitte gib ein Passwort ein." : undefined;
}

export function validateCreatePassword(password) {
  return !containsSecurePassword(password)
    ? "Das Passwort muss aus mindestens 7 Zeichen bestehen."
    : undefined;
}

export function validateComment(comment) {
  return !containsText(comment) ? "Bitte Text eingeben." : undefined;
}

export function validateFileType(fileType) {
  if (fileType.includes("image/png") || fileType.includes("image/jpeg")) {
    return undefined;
  } else {
    return "Bitte .PNG oder .JPEG hochladen.";
  }
}

export function formatISODate(isodate) {
  const dateAndTime = isodate.split("T");
  const date = dateAndTime[0].split("-").reverse().join(".");
  const time = dateAndTime[1].slice(0, 5);
  return date + " at " + time;
}
