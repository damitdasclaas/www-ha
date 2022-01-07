import * as userModel from "./userModel.js";

export async function createUser(ctx) {
  await ctx.render("usercreate");
}

export async function submitCreateUser(ctx) {
  await userModel.addUser(ctx.db, ctx.request.body);
  ctx.redirect("/");
}

export async function deleteUser(ctx) {}
