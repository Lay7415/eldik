const jwt = require("jsonwebtoken");
require("dotenv").config();

const tokenKey = process.env.SECRET_KEY;
class JWTService {
  static async create(payload, options) {
    const token = await jwt.sign(payload, tokenKey, options);
    return token;
  }
  static async compare(token) {
    const decodedToken = await jwt.verify(token, tokenKey);
    return decodedToken;
  }
}

module.exports = JWTService;
