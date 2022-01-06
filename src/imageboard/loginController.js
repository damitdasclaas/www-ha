import * as userModel from "./userModel.js";
import * as csrf from "./csrf.js";

async function renderForm(ctx, preparedData) {
  const token = await csrf.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.flash) {
    ctx.state.flash = ctx.session.flash;
    ctx.session.flash = undefined;
  }

  await ctx.render("login", { form: preparedData, csrf: token });
}

export async function login(ctx) {
  const preparedData = undefined;
  await renderForm(ctx, preparedData);
}

export async function submitForm(ctx) {
  let loginData = ctx.request.body;
  let errors = await validateForm(loginData);

  if (ctx.session.csrf !== loginData._csrf) {
    ctx.throw(401);
  }
  ctx.session.csrf = undefined;

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
        ctx.session.flash = "Du bist als " + user.username + " eingeloggt.";

        ctx.redirect("/profile/" + user.username);
      }
    } else {
      errors = { username: "Dieser Username existiert nicht." };
      loginData.password = undefined;
      loginData = { ...loginData, errors };
      await renderForm(ctx, loginData);
    }
  }
}

export async function logout(ctx) {
  ctx.session.user = undefined;
  ctx.session.flash = "Erfolgreich ausgeloggt.";
  ctx.redirect("/");
}

async function validateForm(loginData) {
  return {
    username: validateUsername(loginData.username),
  };
}

export function containsText(string) {
  return typeof string == "string" && string.length >= 3;
}

export function validateUsername(username) {
  return !containsText(username) ? "Bitte einen Username eingeben." : undefined;
}
