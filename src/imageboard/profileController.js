import * as userModel from "./userModel.js";

export async function upload(ctx) {
  await ctx.render("profile");
}
export async function editProfile(ctx) {
  const newUserData = ctx.request.body;
  await userModel.editUser(ctx.db, newUserData, ctx.params.username);

  console.log(ctx.params.username);
}
export async function uploadProfilePicture(ctx) {
  const uploadPath = ctx.request.files.image.path;

  const fileName = getFileName(uploadPath);
  await userModel.editProfilePicture(ctx.db, ctx.params.username, fileName);

  const userData = await userModel.getUser(ctx.db, ctx.params.username);

  await ctx.render("profileEdit", { user: userData });
}

// --------------Helper functions----------------

function getFileName(filePath) {
  if (filePath.includes("/")) {
    const temp = filePath.split("/");
    return temp[temp.length - 1];
  } else {
    const temp = filePath.split("\\");
    return temp[temp.length - 1];
  }
}

// --------------Helper functions----------------
