require("dotenv").config();
const express = require("express");

const cors = require("cors");

const app = express();

// Enable CORS
app.use(cors());
app.use(express.static("build"));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
