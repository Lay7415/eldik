const ApiError = require("../error/api_error");
const pool = require("../pool_config");

class CommentsController {
  async createComment(req, res) {
    const { user_id } = req.user;
    const { text, post_id } = req.body;
    const comment = await pool.query(
      `INSERT INTO comments(text, post_id,user_id) VALUES($1, $2, $3) RETURNING *`,
      [text, post_id, user_id]
    );
    res.json({ comment: comment.rows[0] });
  }
  async getComments(req, res) {
    const { post_id } = req.query;
    const comment = await pool.query(
      `SELECT * FROM comments WHERE post_id = $1 `,
      [post_id]
    );
    res.json({ comment: comment.rows });
  }
  async updateComment(req, res) {
    const { text, post_id, id } = req.body;
    const comment = await pool.query(
      `UPDATE comments SET text = $1 WHERE post_id = $2 AND id = $3 RETURNING *`,
      [text, post_id, id]
    );
    res.json({ comment: comment.rows[0] });
  }
  async deleteComment(req, res, next) {
    const { user_id } = req.user;
    const { post_id, id } = req.query;
    await pool
      .query(
        `DELETE FROM comments WHERE post_id = $1 AND id = $2 AND user_id = $3`,
        [post_id, id, user_id]
      )
      .catch(() => {
        return next(ApiError.internal("ошибка при удаления комментария"));
      });
    res.json({ message: "комментарий был удален" });
  }
  async createLike(req, res, next) {
    const { user_id } = req.user;
    const {post_id} = req.params;
  }
}

module.exports = new CommentsController();
