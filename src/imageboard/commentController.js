import * as commentModel from "./commentModel.js";
import * as imageModel from "./imageModel.js";

export async function detail(ctx) {
  const imageData = await imageModel.getSingleImage(ctx.db, ctx.params.id);
  const commentData = await commentModel.getComments(ctx.db, ctx.params.id);

  await renderDetailForm(ctx, imageData, commentData);
}

export async function addComment(ctx) {
  const imageData = await imageModel.getSingleImage(ctx.db, ctx.params.id);
  const commentData = await commentModel.getComments(ctx.db, ctx.params.id);

  await commentModel.addComment(ctx.db, ctx.params.id, ctx.request.body);

  await renderDetailForm(ctx, imageData, commentData);
  ctx.redirect("/image/" + ctx.params.id);
}

async function renderDetailForm(ctx, imageData, commentData) {
  await ctx.render("detail", { image: imageData, comments: commentData });
}
