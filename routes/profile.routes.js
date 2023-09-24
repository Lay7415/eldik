const { Router } = require("express");
const profileController = require("../controllers/profile.controllers");
const authorization_middleware = require("../middlewares/authorization_middleware");
const upload = require("../multer_config");

const profileRouter = new Router();

profileRouter.post(
  "/profile",
  [authorization_middleware, upload.single("file")],
  profileController.createProfile
);

module.exports = profileRouter;
