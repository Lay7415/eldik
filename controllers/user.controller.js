const JWTService = require("../services/jwt_service");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const ApiError = require("../error/api_error");
const pool = require("../pool_config");

class UserController {
  async registration(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("введен неправильный пароль или email"));
    }
    const { email, password, name, family, phone, role } = req.body;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await pool
      .query(
        "INSERT INTO users(email, password, name, family, phone, role) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
        [email, hashedPassword, name, family, phone, role]
      )
      .catch(() => {
        return next(
          ApiError.badRequest("Пользователь с таким email уже существует")
        );
      });
    const user_id = newUser?.rows[0]?.id;
    const token = await JWTService.create({ user_id }, { expiresIn: "1h" });
    if (!token) {
      return next(ApiError.internal("ошибка с токеном"));
    }
    res.json({ token });
  }

  async login(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("введен неправильный пароль или email"));
    }
    const { email, password } = req.body;
    const foundUser = await pool
      .query(`SELECT * FROM users WHERE email = $1`, [email])
      .catch(() => {
        return next(ApiError.badRequest("пользователь не найден!"));
      });

      console.log(`SELECT * FROM users WHERE email = '${email}'`)
    if (!foundUser.rows[0]) {
      return next(ApiError.badRequest("пользователь не найден!"));
    }
    const userPassword = foundUser?.rows[0].password;
    await bcrypt.compare(password, userPassword).catch(() => {
      return next(ApiError.badRequest("введен неправильный пароль"));
    });

    const user_id = foundUser?.rows[0].id;
    const token = await JWTService.create({ user_id }, { expiresIn: "1h" });
    if (!token) {
      return next(ApiError.internal("ошибка с токеном"));
    }
    res.json({ token });
  }

  async refresh(req, res, next) {
    const { user_id } = req.user;
    const token = await JWTService.create({ user_id }, { expiresIn: "1h" });
    if (!token) {
      return next(ApiError.internal("ошибка с токеном"));
    }
    res.json({ token });
  }

  async updateProfile(req, res, next) {
    const { user_id } = req.user;
    const {
      email,
      password,
      newPassword,
      name,
      family,
      phone,
      profileDescription,
    } = req.body;

    const foundUser = await pool
      .query(`SELECT * FROM users WHERE id = $1`, [user_id])
      .catch(() => {
        return next(ApiError.badRequest("пользователь не найден!"));
      });
    const userPassword = foundUser.rows[0].password;

    await bcrypt.compare(password, userPassword).catch(() => {
      return next(ApiError.badRequest("введен неправильный пароль"));
    });

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const newUser = await pool
      .query(
        "UPDATE users SET email = $1, password = $2, name = $3, family = $4, phone = $5 WHERE id = $6 RETURNING *",
        [email, hashedPassword, name, family, phone, user_id]
      )
      .catch(() => {
        return next(
          ApiError.badRequest("Ошибка при изменении аккаунат пользователя")
        );
      });

    const newProfile = await pool
      .query(
        "UPDATE profiles SET profileDescription = $1 WHERE user_id = $2 RETURNING *",
        [profileDescription, user_id]
      )
      .catch(() => {
        return next(ApiError.badRequest("Пользователь не существует"));
      });
    res.json({ newUser: newUser.rows[0], newProfile: newProfile.rows[0] });
  }
}

module.exports = new UserController();