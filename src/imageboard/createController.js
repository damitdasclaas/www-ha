import * as userModel from "./userModel.js";
import * as helper from "./helper/helper.js";

export async function createUser(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

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

export async function deleteUser(ctx) {}
