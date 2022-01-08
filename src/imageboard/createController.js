import * as userModel from "./userModel.js";
import * as helper from "./helper/helper.js";

export async function renderForm(ctx, formData, errors) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.state.user = ctx.session.user;
  }

  formData.password = undefined;
  await ctx.render("create", { csrf: token, form: formData, error: errors });
}

export async function createUser(ctx) {
  await renderForm(ctx, undefined, undefined);
}

export async function submitCreateUser(ctx) {
  if (ctx.session.csrf !== ctx.request.body._csrf) {
    ctx.throw(401);
  }
  ctx.session.csrf = undefined;

  const formData = ctx.request.body;

  let errors = await helper.validateCreateForm(formData);

  if (Object.values(errors).some(Boolean)) {
    await renderForm(ctx, formData, errors);
  } else {
    await userModel.addUser(ctx.db, ctx.request.body);
    ctx.redirect("/login");
  }
}
