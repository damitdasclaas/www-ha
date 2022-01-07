import * as userModel from "./userModel.js";
import * as helper from "./helper/helper.js";

export async function editProfile(ctx) {
  const userData = await userModel.getUser(ctx.db, ctx.params.username);
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  await ctx.render("profileEdit", {
    user: userData,
    csrf: token,
  });
}

export async function submitEditProfile(ctx) {
  if (ctx.session.csrf !== ctx.request.body._csrf) {
    ctx.throw(401);
  }
  ctx.session.csrf = undefined;

  const newUserData = ctx.request.body;
  await userModel.editUser(ctx.db, newUserData, ctx.params.username);

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

  if (fileType.includes("image/png") || fileType.includes("image/jpeg")) {
    await userModel.editProfilePicture(ctx.db, ctx.params.username, fileName);
  } else {
    await userModel.deleteFile(uploadPath);
  }

  ctx.redirect("/profile/" + ctx.params.username + "/settings");
}

export async function askDeleteProfile(ctx) {
  const userData = await userModel.getUser(ctx.db, ctx.params.username);
  const token = await helper.generateToken();
  ctx.session.csrf = token;

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
  const userData = await userModel.deleteUser(ctx.db, ctx.params.username);

  ctx.redirect("/profile");
  if (userData != 0) {
    ctx.status = 204;
    ctx.redirect("/profile");

    return;
  } else {
    ctx.status = 404;
    ctx.redirect("/profile");

    return;
  }
}
