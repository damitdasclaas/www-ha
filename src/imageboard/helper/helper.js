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
