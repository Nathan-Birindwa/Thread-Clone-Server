import pg from "pg";
const { Client } = pg;
import dotenv from "dotenv";
dotenv.config();

const db = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  database: process.env.DB_DATABASE,
});

db.connect()
  .then(() => {
    console.log("Database Connected Succesfully");
  })
  .catch((error) => {
    console.error("Database did not connect", error);
  });

export default db;
