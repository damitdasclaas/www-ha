import * as commentModel from "./commentModel.js";
import * as permissionModel from "./permissionModel.js";
import * as imageModel from "./imageModel.js";
import * as helper from "./helper/helper.js";

export async function detail(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.session.user.permissions = await permissionModel.getPermissions(
      ctx.db,
      ctx.session.user.role
    );
    ctx.state.user = ctx.session.user;
  }

  const imageData = await imageModel.getSingleImage(ctx.db, ctx.params.id);
  const commentData = await commentModel.getComments(ctx.db, ctx.params.id);

  await ctx.render("detail", {
    image: imageData,
    comments: commentData,
    csrf: token,
  });
}

export async function submitComment(ctx) {
  if (ctx.session.csrf !== ctx.request.body._csrf) {
    ctx.throw(401);
  }
  ctx.session.csrf = undefined;

  await commentModel.addComment(
    ctx.db,
    ctx.params.id,
    ctx.session.user.username,
    ctx.request.body
  );

  ctx.redirect("/image/" + ctx.params.id);
}

export async function askDelete(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.session.user.permissions = await permissionModel.getPermissions(
      ctx.db,
      ctx.session.user.role
    );
    ctx.state.user = ctx.session.user;
  }

  const imageData = await imageModel.getSingleImage(ctx.db, ctx.params.id);
  const commentData = await commentModel.getSingleComment(
    ctx.db,
    ctx.params.commentid
  );

  await ctx.render("deleteCommentForm", {
    image: imageData,
    comment: commentData,
    csrf: token,
  });
}

export async function deleteCommentById(ctx) {
  if (ctx.session.csrf !== ctx.request.body._csrf) {
    ctx.throw(401);
  }
  ctx.session.csrf = undefined;

  const commentData = await commentModel.deleteSingleComment(
    ctx.db,
    ctx.params.commentid
  );

  if (commentData != 0) {
    ctx.status = 204;
    ctx.redirect("/image/" + ctx.params.id);

    return;
  } else {
    ctx.status = 404;
    ctx.redirect("/");

    return;
  }
}
