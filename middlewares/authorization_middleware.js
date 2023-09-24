const ApiError = require("../error/api_error");
const JWTService = require("../services/jwt_service");

module.exports = async function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      next(ApiError.badRequest("не авторизован!"));
    }
    const decodedToken = await JWTService.compare(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    next(ApiError.badRequest("не авторизован!"));
  }
};
