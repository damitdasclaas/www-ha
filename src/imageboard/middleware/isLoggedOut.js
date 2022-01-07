export default function isLoggedIn() {
  return async function (ctx, next) {
    if (ctx.session.user) {
      ctx.throw(401);
    }
    await next();
  };
}
