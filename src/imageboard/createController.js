import * as userModel from "./userModel.js";
import * as helper from "./helper/helper.js";

export async function createUser(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  await ctx.render("usercreate", { csrf: token });
}

export async function submitCreateUser(ctx) {
  await userModel.addUser(ctx.db, ctx.request.body);
  ctx.redirect("/");
}

export async function deleteUser(ctx) {}
