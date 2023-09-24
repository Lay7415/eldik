const { Router } = require("express");
const locationController = require("../controllers/location.controller");

const locationRouter = new Router();
locationRouter.post("/region", locationController.createRegion);
locationRouter.get("/region", locationController.getRegions);
locationRouter.post("/town", locationController.createTown);
locationRouter.get("/town", locationController.getTowns);
locationRouter.post("/street", locationController.createStreet);
locationRouter.get("/street", locationController.getStreets);
locationRouter.post("/village", locationController.createVillage);
locationRouter.get("/village", locationController.getVillages);

module.exports = locationRouter;
