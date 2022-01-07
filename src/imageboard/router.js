import * as controller from "./controller.js";
import * as createFormController from "./createController.js";
import * as loginFormController from "./loginController.js";
import * as profileFormController from "./profileController.js";
import * as imageFormController from "./imageController.js";
import * as commentFormController from "./commentController.js";
import * as perms from "./hasPermission.js";

import koaBody from "koa-body";
import Router from "@koa/router";

const router = new Router();
export default router;

router.get("/", controller.index);

router.get("/profile", controller.profile);

router.get("/profile/:username", controller.profileDetail);

router.get("/profile/:username/settings", profileFormController.editProfile);
router.post(
  "/profile/:username/settings",
  koaBody(),
  profileFormController.submitEditProfile
);

router.post(
  "/profile/:username/settings/profile_picture",
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + "/web/images/profile_pictures",
      keepExtensions: true,
    },
  }),
  profileFormController.submitEditProfilePicture
);

router.get("/profile/:username/delete", profileFormController.askDeleteProfile);
router.post(
  "/profile/:username/delete",
  koaBody(),
  profileFormController.deleteProfile
);

router.get("/login", loginFormController.login);
router.post("/login", koaBody(), loginFormController.submitLogin);

router.get("/logout", controller.logout);

router.get("/create", createFormController.createUser);
router.post("/create", koaBody(), createFormController.submitCreateUser);

router.get("/upload", imageFormController.upload);
router.post(
  "/upload",
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + "/web/images/uploads",
      keepExtensions: true,
    },
  }),
  imageFormController.submitUpload
);

router.get("/image/:id", commentFormController.detail);
router.post("/image/:id", koaBody(), commentFormController.submitComment);

router.get("/image/:id/delete", imageFormController.askDelete);
router.post(
  "/image/:id/delete",
  koaBody(),
  imageFormController.deleteImageById
);

router.get("/image/:id/:commentid", commentFormController.askDelete);
router.post(
  "/image/:id/:commentid",
  koaBody(),
  commentFormController.deleteCommentById
);
