import * as userModel from "./userModel.js";
import * as imageModel from "./imageModel.js";
import * as commentModel from "./commentModel.js";
import * as helper from "./helper/helper.js";

export async function renderForm(ctx, errors) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.state.user = ctx.session.user;
  }

  const userData = await userModel.getUser(ctx.db, ctx.params.username);

  if (userData != undefined) {
    await ctx.render("profileEdit", {
      userData: userData,
      csrf: token,
      error: errors,
    });
  } else {
    ctx.throw(404);
  }
}

export async function editProfile(ctx) {
  await renderForm(ctx, undefined);
}

export async function submitEditProfile(ctx) {
  if (ctx.session.csrf !== ctx.request.body._csrf) {
    ctx.throw(401);
  }
  ctx.session.csrf = undefined;

  const newUserData = ctx.request.body;

  await userModel.editUser(ctx.db, newUserData, ctx.params.username);
  await userModel.editUserRole(ctx.db, ctx.params.username, newUserData.role);

  if (ctx.session.user.username == ctx.params.username) {
    ctx.session.user = await userModel.getUser(ctx.db, ctx.params.username);
  }

  ctx.redirect("/profile/" + ctx.params.username);
}

export async function submitEditProfilePicture(ctx) {
  if (ctx.session.csrf !== ctx.request.body._csrf) {
    ctx.throw(401);
  }
  ctx.session.csrf = undefined;

  const uploadPath = ctx.request.files.image.path;
  const fileType = ctx.request.files.image.type;

  const fileName = await helper.getFileName(uploadPath);

  const errors = await helper.validateUploadFile(fileType);

  if (Object.values(errors).some(Boolean)) {
    await userModel.deleteFile(uploadPath);

    await renderForm(ctx, errors);
  } else {
    await userModel.editProfilePicture(ctx.db, ctx.params.username, fileName);

    ctx.redirect("/profile/" + ctx.params.username + "/settings");
  }
}

export async function askDeleteProfile(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.state.user = ctx.session.user;
  }

  const userData = await userModel.getUser(ctx.db, ctx.params.username);

  await ctx.render("deleteProfileForm", {
    userData: userData,
    csrf: token,
  });
}

export async function deleteProfile(ctx) {
  if (ctx.session.csrf !== ctx.request.body._csrf) {
    ctx.throw(401);
  }
  ctx.session.csrf = undefined;

  await userModel.deleteProfilePicture(ctx.db, ctx.params.username);
  await imageModel.deleteImagesByUser(ctx.db, ctx.params.username);
  await commentModel.deleteCommentsByUser(ctx.db, ctx.params.username);

  const userData = await userModel.deleteUser(ctx.db, ctx.params.username);

  if (userData != 0) {
    ctx.redirect("/logout");
  } else {
    ctx.throw(404);
  }
}
