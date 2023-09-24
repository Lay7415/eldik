const commentsRouter = require("./comments.routes");
const locationRouter = require("./location.routes");
const petitionRouter = require("./petition.routes");
const postRouter = require("./posts.routes");
const profileRouter = require("./profile.routes");
const usersRouter = require("./users.routes");

const routes = [
  locationRouter,
  usersRouter,
  profileRouter,
  commentsRouter,
  postRouter,
  petitionRouter,
];
module.exports = routes;
