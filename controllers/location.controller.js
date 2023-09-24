const pool = require("../pool_config");

class LocationController {
  async createRegion(req, res) {
    const { text, region_id } = req.body;
    const region = await pool.query(
      "INSERT INTO regions(text, region_id) VALUES($1, $2) RETURNING *",
      [text, region_id]
    );
    return res.json({ response: region.rows[0] });
  }

  async getRegions(req, res) {
    const region = await pool.query("SELECT * FROM regions ");
    return res.json({ response: region });
  }

  async createTown(req, res) {
    const { text, region_id } = req.body;
    const town = await pool.query(
      "INSERT INTO towns(text, region_id) VALUES($1, $2) RETURNING *",
      [text, region_id]
    );
    return res.json({ response: town.rows[0] });
  }

  async getTowns(req, res) {
    const town = await pool.query("SELECT * FROM towns ");
    return res.json({ response: town });
  }

  async createStreet(req, res) {
    const { text, region_id } = req.body;
    const street = await pool.query(
      "INSERT INTO streets(text, region_id) VALUES($1, $2) RETURNING *",
      [text, region_id]
    );
    return res.json({ response: street.rows[0] });
  }

  async getStreets(req, res) {
    const street = await pool.query("SELECT * FROM streets ");
    return res.json({ response: street });
  }

  async createVillage(req, res) {
    const { text, region_id } = req.body;
    const village = await pool.query(
      "INSERT INTO villages(text, region_id) VALUES($1, $2) RETURNING *",
      [text, region_id]
    );
    return res.json({ response: village.rows[0] });
  }

  async getVillages(req, res) {
    const village = await pool.query("SELECT * FROM villages ");
    return res.json({ response: village });
  }
}

module.exports = new LocationController();
