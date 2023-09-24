const ApiError = require("../error/api_error");
const pool = require("../pool_config");

class PostsController {
  async createPost(req, res, next) {
    const { user_id } = req.user;
    const imageUrl = `${req.protocol}://${req.get("host")}/${
      req.file.filename
    }`;
    const {
      title,
      postDescription,
      type,
      tag,
      region,
      town,
      street,
      village,
      time,
    } = req.body;

    const newPost = await pool
      .query(
        "INSERT INTO posts(title, postImage, postDescription, likeAmount, commentsAmount, complaintAmount, type, tag, decided, user_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        [title, imageUrl, postDescription, 0, 0, 0, type, tag, "FALSE", user_id]
      )
      .catch(() => {
        return next(ApiError.internal("ошибка при создании поста"));
      });

    const newLocale = await pool
      .query(
        "INSERT INTO postLocation(region, town, street, village, time, post_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        [region, town, street, village, time, newPost.rows[0].id]
      )
      .catch((err) => {
        console.log(err);
        return next(ApiError.internal("ошибка сервера"));
      });

    if (!newLocale) {
      return next(ApiError.internal());
    }

    // console.log(newLocale)

    res.json({ newPost: { ...newPost.rows[0], newLocale: newLocale.rows[0] } });
  }

  async getPosts(req, res, next) {
    const {
      likeAmount,
      minlikeAmount,
      maxlikeAmount,
      commentsAmount,
      mincommentsAmount,
      maxcommentsAmount,
      complaintAmount,
      mincomplaintAmount,
      maxcomplaintAmount,
      type,
      tag,
      decided = "FALSE",
      userId,
    } = req.query;

    let query = "SELECT * FROM posts";
    const queryParams = [];
    let count = 0;

    if (Object.keys(req.query).length !== 0) {
      count += 1;
      query += ` WHERE decided = $${count}`;
      queryParams.push(decided);
    }
    if (likeAmount) {
      count += 1;
      query += ` AND likeAmount = $${count}`;
      queryParams.push(likeAmount);
    }
    if (minlikeAmount) {
      count += 1;
      query += ` AND likeAmount >= $${count}`;
      queryParams.push(minlikeAmount);
    }
    if (maxlikeAmount) {
      count += 1;
      query += ` AND likeAmount <= $${count}`;
      queryParams.push(maxlikeAmount);
    }
    if (commentsAmount) {
      count += 1;
      query += ` AND commentsAmount = $${count}`;
      queryParams.push(commentsAmount);
    }
    if (mincommentsAmount) {
      count += 1;
      query += ` AND commentsAmount >= $${count}`;
      queryParams.push(mincommentsAmount);
    }
    if (maxcommentsAmount) {
      count += 1;
      query += ` AND commentsAmount <= $${count}`;
      queryParams.push(maxcommentsAmount);
    }
    if (complaintAmount) {
      count += 1;
      query += ` AND complaintAmount = $${count}`;
      queryParams.push(complaintAmount);
    }
    if (mincomplaintAmount) {
      count += 1;
      query += ` AND complaintAmount >= $${count}`;
      queryParams.push(mincomplaintAmount);
    }
    if (maxcomplaintAmount) {
      count += 1;
      query += ` AND complaintAmount <= $${count}`;
      queryParams.push(maxcomplaintAmount);
    }
    if (type) {
      count += 1;
      query += ` AND type = $${count}`;
      queryParams.push(type);
    }
    if (tag) {
      count += 1;
      query += ` AND tag = $${count}`;
      queryParams.push(tag);
    }
    if (userId) {
      count += 1;
      query += ` AND user_id = $${count}`;
      queryParams.push(userId);
    }

    const posts = await pool.query(query, [...queryParams]);
    res.json({ posts: posts.rows });
  }

  async updatePost(req, res) {
    const imageUrl = `${req.protocol}://${req.get("host")}/${
      req.file.filename
    }`;

    const { title, postDescription, type, tag, decided, postId } = req.body;

    const post = await pool
      .query(
        "UPDATE posts SET title = $1, postDescription = $2, type = $3, tag = $4, decided = $5, postImage = $6 WHERE id = $7 RETURNING *",
        [title, postDescription, type, tag, decided, imageUrl, postId]
      )
      .catch(() => {
        return next(ApiError.internal("ошибка при изменении поста"));
      });

    res.json({ newPost: post.rows[0] });
  }

  async deletePost(req, res, next) {
    const { id } = req.params;
    await pool.query("DELETE FROM posts WHERE id = $1", [id]).catch(() => {
      return next(ApiError.internal("ошибка при удалении поста"));
    });
    await pool
      .query("DELETE FROM postLocation WHERE id = $1", [id])
      .catch(() => {
        return next(ApiError.internal("ошибка при удалении поста"));
      });
    await pool.query("DELETE FROM comments WHERE id = $1", [id]).catch(() => {
      return next(ApiError.internal("ошибка при удалении поста"));
    });

    return res.json({ message: "пост был успешно удален" });
  }

  async createLike(req, res, next) {
    const { user_id } = req.user;
    const { id } = req.query;
    const liked = await pool.query(
      "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",
      [user_id, id]
    );
    if (liked.rows[0]) {
      return next(ApiError.internal("пользователь уже сделал лайк"));
    }
    const like = pool
      .query(`INSERT INTO likes(user_id, post_id) VALUES($1, $2)`, [
        user_id,
        id,
      ])
      .catch((err) => {
        console.log(err)
        return next(ApiError.internal("ошибка сервера"));
      });
    const post = await pool
      .query(
        "UPDATE posts SET likeAmount = likeAmount + 1 WHERE id = $1 RETURNING *",
        [id]
      )
      .catch(() => {
        return next(ApiError.internal("ошибка при изменении поста"));
      });
    res.json({ like, post });
  }
}

module.exports = new PostsController();
