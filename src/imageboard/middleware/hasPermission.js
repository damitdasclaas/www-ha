import * as helper from "../helper/helper.js";

export default function hasPermission(permission) {
  return async function (ctx, next) {
    if (helper.checkAdmin(ctx.session.user)) {
      await next();
    } else {
      if (!helper.checkPermission(ctx.session.user, permission)) {
        ctx.throw(401);
      }
      await next();
    }
  };
}
