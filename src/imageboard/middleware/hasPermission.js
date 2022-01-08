import * as helper from "../helper/helper.js";
import * as imageModel from "../imageModel.js";
import * as commentModel from "../commentModel.js";
import * as userModel from "../userModel.js";

export default function hasPermission(permission) {
  return async function (ctx, next) {
    if (helper.checkAdmin(ctx.session.user)) {
      await next();
    } else {
      const sessionUsername = ctx.session.user.username;
      let user;
      let image;
      let comment;

      switch (permission) {
        case "edit profile":
          user = await userModel.getUser(ctx.db, ctx.params.username);

          if (user.username == sessionUsername) {
            await next();
          } else {
            ctx.throw(401);
          }
          break;

        case "edit role":
          ctx.throw(401);
          break;

        case "delete profile":
          user = await userModel.getUser(ctx.db, ctx.params.username);

          if (user.username == sessionUsername) {
            await next();
          } else {
            ctx.throw(401);
          }
          break;

        case "delete image":
          image = await imageModel.getSingleImage(ctx.db, ctx.params.id);

          if (image.author == sessionUsername) {
            await next();
          } else {
            ctx.throw(401);
          }
          break;

        case "delete comment":
          comment = await commentModel.getSingleComment(
            ctx.db,
            ctx.params.commentid
          );

          if (comment.author == sessionUsername) {
            await next();
          } else {
            ctx.throw(401);
          }
          break;
      }
    }
  };
}
