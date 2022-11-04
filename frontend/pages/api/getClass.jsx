// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Database, OPEN_READONLY } from "sqlite3";

import path from "path";

// get the database from the root of the repo
const dbPath = path.resolve(process.cwd(), "../ProcessedData.db");

const db = new Database(dbPath, OPEN_READONLY);

export default function handler(req, res) {
  if (!req.query.class_name) {
    res.status(400).json({ error: "Missing class_name in query string" });
    return;
  }

  const sql =
    "SELECT * FROM classdistribution WHERE REPLACE(class_name, ' ', '') = REPLACE($class_name, ' ' , '')";

  const params = {
    $class_name: req.query.class_name,
  };

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Database error, please try again later.",
        error: err.message,
      });
      return;
    }

    if (rows.length) {
      res.status(200).json({
        success: true,
        data: rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Class Not Found",
      });
    }
  });
}