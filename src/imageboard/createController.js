import * as userModel from "./userModel.js";
import * as permissionModel from "./permissionModel.js";
import * as helper from "./helper/helper.js";

export async function createUser(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.session.user.permissions = await permissionModel.getPermissions(
      ctx.db,
      ctx.session.user.role
    );
    ctx.state.user = ctx.session.user;
  }

  await ctx.render("create", { csrf: token });
}

export async function submitCreateUser(ctx) {
  if (ctx.session.csrf !== ctx.request.body._csrf) {
    ctx.throw(401);
  }
  ctx.session.csrf = undefined;

  await userModel.addUser(ctx.db, ctx.request.body);
  ctx.redirect("/login");
}
