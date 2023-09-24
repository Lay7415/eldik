const { Router } = require("express");
const commentsController = require("../controllers/comments.controller");
const authorization_middleware = require("../middlewares/authorization_middleware");

const commentsRouter = new Router();

commentsRouter.post(
  "/comments",
  authorization_middleware,
  commentsController.createComment
);

commentsRouter.get(
  "/comments",
  authorization_middleware,
  commentsController.getComments
);
commentsRouter.put("/comments", commentsController.updateComment);
commentsRouter.delete("/comments",authorization_middleware, commentsController.deleteComment);

module.exports = commentsRouter;
