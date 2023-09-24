const { Router } = require("express");
const postController = require("../controllers/post.controller");
const authorization_middleware = require("../middlewares/authorization_middleware");
const upload = require("../multer_config");

const postRouter = new Router();

postRouter.post(
  "/post",
  [authorization_middleware, upload.single("file")],
  postController.createPost
);

postRouter.get("/post", authorization_middleware, postController.getPosts);
postRouter.put(
  "/post",
  [authorization_middleware, upload.single("file")],
  postController.updatePost
);
postRouter.delete(
  "/post/:id",
  authorization_middleware,
  postController.deletePost
);
postRouter.get(
  "/post/like",
  authorization_middleware,
  postController.createLike
);

module.exports = postRouter;
