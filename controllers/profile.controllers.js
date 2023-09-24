const ApiError = require("../error/api_error");
const pool = require("../pool_config");

class ProfileController {
  async createProfile(req, res, next) {
    if (!req.file) {
      return next(ApiError.badRequest("файл не создан"));
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/${
      req.file.filename
    }`;

    const { profileDescription } = req.body;

    const { user_id } = req.user;
    const profile = await pool
      .query(
        "INSERT INTO profiles(pointAmount, problemAmount, problemSolutionAmount, profileDescription, user_id, avatar) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        [0, 0, 0, profileDescription, user_id, imageUrl]
      )
      .catch(() => {
        return next(ApiError.internal("ошибка при создании профиля"));
      });

    res.json({ profile: profile.rows[0] });
  }
}

module.exports = new ProfileController();
