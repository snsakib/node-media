const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const port = 3000;

app.use(cors());

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "node_media",
  password: "root",
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("PostgreSQL connected:", result.rows);
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.post(
  "/",
  upload.fields([
    { name: "single_image", maxCount: 1 },
    { name: "multiple_images", maxCount: 2 }, // adjust maxCount as needed
    { name: "single_video", maxCount: 1 },
    { name: "multiple_videos", maxCount: 2 },
    { name: "single_audio", maxCount: 1 },
    { name: "multiple_audios", maxCount: 2 },
  ]),
  async (req, res) => {
    try {
      const { title } = req.body;

      // Helper to get file path or null
      const getFilePath = (filesArr) =>
        filesArr && filesArr.length > 0 ? filesArr[0].path : null;
      const getFilePaths = (filesArr) =>
        filesArr ? filesArr.map((f) => f.path) : [];

      const single_image = getFilePath(req.files["single_image"]);
      const multiple_images = getFilePaths(req.files["multiple_images"]);
      const single_video = getFilePath(req.files["single_video"]);
      const multiple_videos = getFilePaths(req.files["multiple_videos"]);
      const single_audio = getFilePath(req.files["single_audio"]);
      const multiple_audios = getFilePaths(req.files["multiple_audios"]);

      const insertQuery = `
        INSERT INTO media_files
          (title, single_image, multiple_images, single_video, multiple_videos, single_audio, multiple_audios)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const values = [
        title,
        single_image,
        multiple_images,
        single_video,
        multiple_videos,
        single_audio,
        multiple_audios,
      ];

      const result = await pool.query(insertQuery, values);

      res.json({ status: "ok", data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "error", error: err.message });
    }
  }
);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
