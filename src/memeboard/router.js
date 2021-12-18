import * as controller from "./controller.js";

import Router from "@koa/router";
const router = new Router();
export default router;

router.get("/", controller.index);
