import * as controller from "./controller.js";

import koaBody from "koa-body";
import Router from "@koa/router";

const router = new Router();
export default router;

router.get("/", controller.index);

router.get(
  "/image/:id",
  controller.detail /* detailseitencontroller, mit kommentare etc */
);

router.get("/profile", controller.profile /* profilseiten controller */);

router.get("/login", controller.login /* Login controller */);
router.post("/login", koaBody() /* Login controller */);

router.get(
  "/settings",
  controller.settings /* settingsseite, kein plan was genau*/
);

router.get("/files", controller.upload /*uploadcontroller*/);
router.post(
  "/upload",
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + "/web/images/uploads",
      keepExtensions: true,
      fileName: "upload",
      onFileBegin: (formName, file) => {
        console.log(formName);
        console.log(file);
        file.path = process.cwd() + "/web/images/uploads/" + file.name;
      },
    },
  }),
  controller.upload /*uploadcontroller*/
);

// auf image propertie damit nur bilder hochgeladen werden können überprüfen in ctx.request.body oder ctx.request.files oder so
