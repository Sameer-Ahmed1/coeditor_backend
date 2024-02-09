require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 4001;

module.exports = {
  MONGODB_URI,
  PORT,
};
