import * as imageModel from "./imageModel.js";
import * as commentModel from "./commentModel.js";
import * as userModel from "./userModel.js";
import * as permissionModel from "./permissionModel.js";

async function renderForm(ctx, preparedData) {
  const token = await csrf.generateToken();
  ctx.session.csrf = token;

  await ctx.render("upload", { form: preparedData, csrf: token });
}

export async function upload(ctx) {
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

export async function upload(ctx) {
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

export async function askDelete(ctx) {
  const imageData = await imageModel.getSingleImage(ctx.db, ctx.params.id);

  await ctx.render("deleteForm", {
    image: imageData,
  });
}

export async function deleteImageById(ctx) {
  const imageData = await imageModel.deleteImageById(ctx.db, ctx.params.id);
  const commentData = await commentModel.deleteCommentsByImage(
    ctx.db,
    ctx.params.id
  );
  ctx.redirect("/");

  if (imageData != 0 && commentData != 0) {
    ctx.status = 204;
    ctx.redirect("/");

    return;
  } else {
    ctx.status = 404;
    ctx.redirect("/");

    return;
  }
}

export async function deleteCommentById(ctx) {
  const commentData = await commentModel.deleteSingleComment(
    ctx.db,
    ctx.params.commentid
  );

  if (commentData != 0) {
    ctx.status = 204;
    ctx.redirect("/image/" + ctx.params.id);

    return;
  } else {
    ctx.status = 404;
    ctx.redirect("/");

    return;
  }
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

function checkPermission(user, permission) {
  return user.permissions.includes(permission);
}
// ----------------------------------------------
