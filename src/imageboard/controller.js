import * as model from "./model.js";

export async function index(ctx) {
  const imageData = await model.getAllImages(ctx.db);
  const accepts = ctx.accepts("text/html", "application/json");

  if (accepts == "text/html") {
    ctx.status = 200;
    await ctx.render("index", { images: imageData });
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

export async function renderUpload(ctx) {
  const accepts = ctx.accepts("text/html", "application/json");

  if (accepts == "text/html") {
    ctx.status = 200;
    await ctx.render("upload");
  }
}

export async function upload(ctx) {
  const accepts = ctx.accepts("text/html", "application/json");
  const fileName = getFileName(ctx.request.files.image.path);
  await model.addImage(ctx.db, fileName);
  ctx.redirect("/");

  if (accepts == "text/html") {
    ctx.status = 200;
    await ctx.render("upload");
  }
}

function getFileName(filePath) {
  const temp = filePath.split("/");
  return temp[temp.length - 1];
}

export async function deleteImageById(ctx) {
  const imageData = await model.deleteImageById(ctx.db, ctx.params.id);
  const commentData = await model.deleteCommentsByImage(ctx.db, ctx.params.id);
  ctx.redirect("/");

  if (imageData != 0 && commentData != 0) {
    ctx.status = 204;
    return;
  } else {
    ctx.status = 404;
    return;
  }
}

export async function askDelete(ctx) {
  const imageData = await model.getSingleImage(ctx.db, ctx.params.id);

  await ctx.render("deleteForm", {
    image: imageData,
  });
}
