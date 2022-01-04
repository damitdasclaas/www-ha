import * as controller from "./controller.js";
import * as commentFormController from "./commentController.js";
import * as loginFormController from "./loginController.js";
import * as createFormController from "./createController.js";

import fs from "fs";

import koaBody from "koa-body";
import Router from "@koa/router";
import createError from "http-errors";

const router = new Router();
export default router;

router.get("/", controller.index);

router.get("/profile", controller.profile /* profilseiten controller */);

router.get("/login", controller.login);
router.post("/login", koaBody(), loginFormController.login);

router.get("/logout", loginFormController.logout);

router.get("/create", controller.createUser);
router.post("/create", koaBody(), createFormController.createUser);

router.get("/upload", controller.renderUpload);
router.post(
  "/upload",
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + "/web/images/uploads",
      keepExtensions: true,
      onFileBegin: (formName, file) => {
        if (file.type != "image/jpeg") {
          if (file.type != "image/png") {
            //upload unterbinden
          }
        }
      },
    },
  }),
  controller.upload
);

router.get("/image/:id", commentFormController.detail);
router.post("/image/:id", koaBody(), commentFormController.addComment);

router.get("/image/:id/delete", controller.askDelete);
router.post("/image/:id/delete", controller.deleteImageById);

router.get("/image/:id/:commentid", controller.deleteCommentById);
