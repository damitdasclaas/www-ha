import Koa from "koa";
import views from "koa-views";
import serve from "koa-static";

import http from "http";
import router from "./imageboard/router.js";

export default async function webApp(config) {
  const app = new Koa();

  const templateDir = process.cwd() + "/views";
  const render = views(templateDir, {
    extension: "html",
    map: { html: "nunjucks" },
    options: {
      nunjucks: { loader: templateDir },
    },
  });

  app.context.render = render();
  app.context.db = config.db;

  // Insert Middleware here!

  app.use(router.routes());
  app.use(serve(process.cwd() + "/web"));

  return http.createServer(app.callback()).listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
  });
}
