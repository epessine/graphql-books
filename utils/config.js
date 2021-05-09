require('dotenv').config();

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  DB_URI,
  PORT,
  SECRET_KEY
};
