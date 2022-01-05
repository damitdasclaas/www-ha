import Koa from "koa";
import views from "koa-views";
import serve from "koa-static";
import session from "koa-session";
import SQLite3Store from "koa-sqlite3-session";

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

  app.keys = ["nejA9fz-*Qwyq_ECR@t^eaM=+FvmPZGz"];
  app.context.render = render();
  app.context.db = config.db;

  // Insert Middleware here!

  app.use(router.routes());
  app.use(serve(process.cwd() + "/web"));
  app.use(session({ store: new SQLite3Store("./data/session.sqlite") }, app));

  return http.createServer(app.callback()).listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
  });
}
