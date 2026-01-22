const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// storage for audio files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// upload route
app.post("/upload", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file received" });
  }

  console.log("Received file:", req.file.filename);

  res.json({
    message: "Audio uploaded successfully",
    filename: req.file.filename,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
