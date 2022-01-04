import * as controller from "./controller.js";
import * as formController from "./formController.js";

import koaBody from "koa-body";
import Router from "@koa/router";

const router = new Router();
export default router;

router.get("/", controller.index);

router.get("/image/:id", formController.detail);
router.post("/image/:id", koaBody(), formController.addComment);

router.get("/image/:id/delete", controller.askDelete);
router.post("/image/:id/delete", controller.deleteImageById);

router.get("/image/:id/:commentid", controller.deleteCommentById);

router.get("/profile", controller.profile /* profilseiten controller */);

router.get("/login", controller.login /* Login controller */);
router.post("/login", koaBody() /* Login controller */);

router.get("/settings", controller.settings /* settingsseite oder so*/);

router.get("/upload", controller.renderUpload /*uploadcontroller*/);
router.post(
  "/upload",
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + "/web/images/uploads",
      keepExtensions: true,
    },
  }),
  controller.upload /*uploadcontroller*/
);

// auf image propertie damit nur bilder hochgeladen werden können überprüfen in ctx.request.body oder ctx.request.files oder so
// das ist eine test zeile
