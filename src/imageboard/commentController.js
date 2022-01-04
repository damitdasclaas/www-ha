import * as commentModel from "./commentModel.js";
import * as imageModel from "./imageModel.js";

export async function detail(ctx) {
  const imageData = await imageModel.getSingleImage(ctx.db, ctx.params.id);
  const commentData = await commentModel.getComments(ctx.db, ctx.params.id);

  const accepts = ctx.accepts("text/html", "application/json");

  if (accepts == "text/html") {
    ctx.status = 200;
    await ctx.render("detail", { image: imageData, comments: commentData });
  }
}

export async function addComment(ctx) {
  const imageData = await imageModel.getSingleImage(ctx.db, ctx.params.id);
  const commentData = await commentModel.getComments(ctx.db, ctx.params.id);
  const accepts = ctx.accepts("text/html", "application/json");

  await commentModel.addComment(ctx.db, ctx.params.id, ctx.request.body);

  if (accepts == "text/html") {
    ctx.status = 200;
    await ctx.render("detail", { image: imageData, comments: commentData });
    ctx.redirect("/image/" + ctx.params.id);
  }
}
