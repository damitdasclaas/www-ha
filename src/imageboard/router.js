import * as controller from "./controller.js";

import koaBody from "koa-body";
import Router from "@koa/router";

const router = new Router();
export default router;

router.get("/", controller.index);

router.get("/image/:filename" /* detailseitencontroller, mit kommentare etc */);

router.get("/profile" /* profilseiten controller */);

router.get("/login" /* Login controller */);
router.post("/login", koaBody() /* Login controller */);

router.get("/settings" /* settingsseite, kein plan was genau*/);

router.get("/files" /*uploadcontroller*/);
router.post("/upload", koaBody() /*uploadcontroller*/);

// auf image propertie damit nur bilder hochgeladen werden können überprüfen in ctx.request.body oder ctx.request.files oder so
