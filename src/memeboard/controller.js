import * as model from "./model.js";

export async function index(ctx) {
  const data = await model.all(ctx.db);
  const accepts = ctx.accepts("text/html", "application/json");

  if (accepts == "text/html") {
    ctx.status = 200;
    await ctx.render("index", {
      bookmarks: data,
    });
  }
}
