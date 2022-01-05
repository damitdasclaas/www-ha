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
  const fileType = ctx.request.files.image.type;

  const fileName = getFileName(uploadPath);

  if (fileType.includes("image/png") || fileType.includes("image/jpeg")) {
    await userModel.editProfilePicture(ctx.db, ctx.params.username, fileName);
  } else {
    await userModel.deleteFile(uploadPath);
  }

  const userData = await userModel.getUser(ctx.db, ctx.params.username);

  await ctx.render("profileEdit", { user: userData });
}

export async function TEST(ctx) {
  const uploadPath = ctx.request.files.image.path;
  const fileType = ctx.request.files.image.type;

  const fileName = getFileName(uploadPath);

  if (fileType.includes("image/png") || fileType.includes("image/jpeg")) {
    await imageModel.addImage(ctx.db, fileName);
  } else {
    await imageModel.deleteFile(uploadPath);
  }

  await ctx.render("upload");
  ctx.redirect("/");
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
