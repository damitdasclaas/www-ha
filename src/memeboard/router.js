import * as controller from "./controller/defaultController.js";
import * as createFormController from "./controller/createController.js";
import * as loginFormController from "./controller/loginController.js";
import * as profileFormController from "./controller/profileController.js";
import * as imageFormController from "./controller/imageController.js";
import * as commentFormController from "./controller/commentController.js";

import hasPermission from "./middleware/hasPermission.js";
import flash from "./middleware/flash.js";
import isLoggedIn from "./middleware/isLoggedIn.js";
import isLoggedOut from "./middleware/isLoggedOut.js";

import koaBody from "koa-body";
import Router from "@koa/router";

const router = new Router();
export default router;

router.get("/", flash(), controller.index);

router.get("/login", isLoggedOut(), flash(), loginFormController.login);
router.post(
  "/login",
  isLoggedOut(),
  koaBody(),
  loginFormController.submitLogin
);

router.get("/logout", isLoggedIn(), controller.logout);

router.get("/create", isLoggedOut(), createFormController.createUser);
router.post(
  "/create",
  isLoggedOut(),
  koaBody(),
  createFormController.submitCreateUser
);

router.get("/upload", isLoggedIn(), imageFormController.upload);
router.post(
  "/upload",
  isLoggedIn(),
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + "/web/images/uploads",
      keepExtensions: true,
    },
  }),
  imageFormController.submitUpload
);

router.get("/profile", controller.profile);

router.get("/profile/:username", flash(), controller.profileDetail);

router.get(
  "/profile/:username/settings",
  isLoggedIn(),
  hasPermission("edit profile"),
  profileFormController.editProfile
);
router.post(
  "/profile/:username/settings",
  isLoggedIn(),
  hasPermission("edit profile"),
  koaBody(),
  profileFormController.submitEditProfile
);

router.post(
  "/profile/:username/settings/change_role",
  isLoggedIn(),
  hasPermission("edit role"),
  koaBody(),
  profileFormController.submitEditProfileRole
);

router.post(
  "/profile/:username/settings/profile_picture",
  isLoggedIn(),
  hasPermission("edit profile"),
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + "/web/images/profile_pictures",
      keepExtensions: true,
    },
  }),
  profileFormController.submitEditProfilePicture
);

router.get(
  "/profile/:username/delete",
  isLoggedIn(),
  hasPermission("delete profile"),
  profileFormController.askDeleteProfile
);
router.post(
  "/profile/:username/delete",
  isLoggedIn(),
  hasPermission("delete profile"),
  koaBody(),
  profileFormController.deleteProfile
);

router.get("/image/:id", flash(), commentFormController.detail);
router.post(
  "/image/:id/addcomment",
  isLoggedIn(),
  koaBody(),
  commentFormController.submitComment
);

router.get(
  "/image/:id/delete",
  isLoggedIn(),
  hasPermission("delete image"),
  imageFormController.askDelete
);
router.post(
  "/image/:id/delete",
  isLoggedIn(),
  hasPermission("delete image"),
  koaBody(),
  imageFormController.deleteImageById
);

router.get(
  "/image/:id/:commentid",
  isLoggedIn(),
  hasPermission("delete comment"),
  commentFormController.askDelete
);
router.post(
  "/image/:id/:commentid",
  isLoggedIn(),
  hasPermission("delete comment"),
  koaBody(),
  commentFormController.deleteCommentById
);

router.get("/documentation", controller.documentation);
router.get("/diary", controller.diary);
router.get("/impressum", controller.impressum);
