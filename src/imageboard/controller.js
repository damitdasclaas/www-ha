import * as model from "./model.js";

export async function index(ctx) {
  const imageData = await model.getAllImages(ctx.db);
  const accepts = ctx.accepts("text/html", "application/json");

  if (accepts == "text/html") {
    ctx.status = 200;
    await ctx.render("index", { images: imageData });
  }
}

export async function detail(ctx) {
  const imageData = await model.getSingleImage(ctx.db, ctx.params.id);
  const commentData = await model.getComments(ctx.db, ctx.params.id);

  const accepts = ctx.accepts("text/html", "application/json");

  if (accepts == "text/html") {
    ctx.status = 200;
    await ctx.render("detail", { image: imageData, comments: commentData });
  }
}
export async function profile(ctx) {
  const accepts = ctx.accepts("text/html", "application/json");

  if (accepts == "text/html") {
    ctx.status = 200;
    await ctx.render("profile");
  }
}
export async function login(ctx) {
  const accepts = ctx.accepts("text/html", "application/json");

  if (accepts == "text/html") {
    ctx.status = 200;
    await ctx.render("login");
  }
}
export async function settings(ctx) {
  const accepts = ctx.accepts("text/html", "application/json");

  if (accepts == "text/html") {
    ctx.status = 200;
    await ctx.render("settings");
  }
}
export async function upload(ctx) {
  const accepts = ctx.accepts("text/html", "application/json");

  if (accepts == "text/html") {
    ctx.status = 200;
    await ctx.render("upload");
  }
}
