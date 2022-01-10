import * as userModel from "../model/userModel.js";
import * as helper from "../helper/helper.js";

async function renderForm(ctx, preparedData) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.state.user = ctx.session.user;
  }

  await ctx.render("login", { form: preparedData, csrf: token });
}

export async function login(ctx) {
  const preparedData = undefined;
  await renderForm(ctx, preparedData);
}

export async function submitLogin(ctx) {
  if (ctx.session.csrf !== ctx.request.body._csrf) {
    ctx.throw(401);
  }
  ctx.session.csrf = undefined;

  let loginData = ctx.request.body;
  let errors = await helper.validateLoginForm(loginData);

  if (Object.values(errors).some(Boolean)) {
    loginData.password = undefined;
    loginData = { ...loginData, errors };

    await renderForm(ctx, loginData);
  } else {
    const user = await userModel.getUser(ctx.db, loginData.username);
    if (user != undefined) {
      if (await userModel.validatePassword(user, loginData.password)) {
        user.password_hash = undefined;
        ctx.session.user = user;
        ctx.session.flash = "You are logged in as " + user.username + ".";

        ctx.redirect("/profile/" + user.username);
      } else {
        errors = { password: "Password doesn't match." };

        loginData.password = undefined;
        loginData = { ...loginData, errors };

        await renderForm(ctx, loginData);
      }
    } else {
      errors = { username: "This username doesn't exists." };

      loginData.password = undefined;
      loginData = { ...loginData, errors };

      await renderForm(ctx, loginData);
    }
  }
}
