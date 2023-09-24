const { Router } = require("express");
const petitionController = require("../controllers/petition.controller");
const authorization_middleware = require("../middlewares/authorization_middleware");

const petitionRouter = new Router();

petitionRouter.post(
  "/petition",
  [authorization_middleware],
  petitionController.createPetition
);

module.exports = petitionRouter;
