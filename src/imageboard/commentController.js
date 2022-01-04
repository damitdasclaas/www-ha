import * as model from "./model.js";

export async function detail(ctx) {
  const imageData = await model.getSingleImage(ctx.db, ctx.params.id);
  const commentData = await model.getComments(ctx.db, ctx.params.id);

  const accepts = ctx.accepts("text/html", "application/json");

  if (accepts == "text/html") {
    ctx.status = 200;
    await ctx.render("detail", { image: imageData, comments: commentData });
  }
}

export async function addComment(ctx) {
  const imageData = await model.getSingleImage(ctx.db, ctx.params.id);
  const commentData = await model.getComments(ctx.db, ctx.params.id);
  const accepts = ctx.accepts("text/html", "application/json");

  await model.addComment(ctx.db, ctx.params.id, ctx.request.body);

  if (accepts == "text/html") {
    ctx.status = 200;
    await ctx.render("detail", { image: imageData, comments: commentData });
    ctx.redirect("/image/" + ctx.params.id);
  }
}
