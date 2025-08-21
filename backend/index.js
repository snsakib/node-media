const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const port = 3000;

app.use(cors());

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
    { name: "single_audio", maxCount: 1},
    { name: "multiple_audios", maxCount: 2}
  ]),
  (req, res) => {
    console.log("Body:", req.body); // Other form fields
    console.log("Single File:", req.files["single_image"]); // Array with 1 file or undefined
    console.log("Multiple Files:", req.files["multiple_images"]); // Array of files or undefined
    console.log("Single Video:", req.files["single_video"]);
    console.log("Multiple Videos:", req.files["multiple_videos"]); // Array of files or undefined
    console.log("Single Audio:", req.files["single_audio"]);
    console.log("Multiple Audios:", req.files["multiple_audios"]);
    res.json({ status: "ok" });
  }
);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
