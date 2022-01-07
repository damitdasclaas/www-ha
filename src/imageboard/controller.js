import * as imageModel from "./imageModel.js";
import * as commentModel from "./commentModel.js";
import * as userModel from "./userModel.js";
import * as permissionModel from "./permissionModel.js";
import * as helper from "./helper/helper.js";

export async function index(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.flash) {
    ctx.state.flash = ctx.session.flash;
    ctx.session.flash = undefined;
  }

  const imageData = await imageModel.getAllImages(ctx.db);

  await ctx.render("index", { images: imageData });
}

export async function profile(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  const userData = await userModel.getAllUser(ctx.db);

  await ctx.render("profile", {
    users: userData,
  });
}

export async function logout(ctx) {
  ctx.session.user = undefined;
  ctx.session.flash = "Erfolgreich ausgeloggt.";

  ctx.redirect("/");
}

export async function profileDetail(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.session.user.permissions = await permissionModel.getPermissions(
      ctx.db,
      ctx.session.user.role
    );
    ctx.state.user = ctx.session.user;
  }

  if (ctx.session.flash) {
    ctx.state.flash = ctx.session.flash;
    ctx.session.flash = undefined;
  }

  const userData = await userModel.getUser(ctx.db, ctx.params.username);

  await ctx.render("profileDetail", {
    userData: userData,
  });
}
