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

export async function checkPermission(user, permission) {
  return user.permissions.includes(permission);
}

// ISO String aufbereitungs function machen
