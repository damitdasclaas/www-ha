import * as userModel from "./userModel.js";

export async function login(ctx) {
  const loginData = ctx.request.body;
  if (
    await userModel.validatePassword(
      ctx.db,
      loginData.username,
      loginData.password
    )
  ) {
    const userData = await userModel.getUser(ctx.db, loginData.username);
    await ctx.render("Profile", { user: userData });

    ctx.redirect("/profile/" + userData.username);
  } else {
    ctx.render("login", { error: "Wrong Password!" });
  }
}

export async function logout(ctx) {}
