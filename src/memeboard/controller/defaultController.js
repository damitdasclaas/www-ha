import * as imageModel from "../model/imageModel.js";
import * as userModel from "../model/userModel.js";
import * as helper from "../helper/helper.js";

export async function index(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.state.user = ctx.session.user;
  }

  const imageData = await imageModel.getAllImages(ctx.db);

  if (imageData[0] != undefined) {
    imageData.map(
      (image) =>
        (image.date_uploaded = helper.formatISODate(image.date_uploaded))
    );
  }

  await ctx.render("index", { images: imageData });
}

export async function profile(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.state.user = ctx.session.user;
  }

  const userData = await userModel.getAllUser(ctx.db);

  await ctx.render("profile", {
    users: userData,
  });
}

export async function profileDetail(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.state.user = ctx.session.user;
  }

  const userData = await userModel.getUser(ctx.db, ctx.params.username);

  if (userData != undefined) {
    await ctx.render("profileDetail", {
      userData: userData,
    });
  } else {
    ctx.throw(404);
  }
}

export async function logout(ctx) {
  ctx.session.user = undefined;
  ctx.session.flash = "Successfully logged out.";

  ctx.redirect("/");
}

export async function documentation(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.state.user = ctx.session.user;
  }

  await ctx.render("documentation");
}

export async function diary(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.state.user = ctx.session.user;
  }

  await ctx.render("diary");
}

export async function impressum(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.state.user = ctx.session.user;
  }

  await ctx.render("impressum");
}
