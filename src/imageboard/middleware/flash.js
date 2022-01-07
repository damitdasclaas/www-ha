export default function flash() {
  return async function (ctx, next) {
    if (ctx.session.flash) {
      ctx.state.flash = ctx.session.flash;
      ctx.session.flash = undefined;
    }
    await next();
  };
}
