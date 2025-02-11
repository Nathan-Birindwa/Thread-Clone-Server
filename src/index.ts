import express, { NextFunction, query, Request, Response } from "express";
import dotenv from "dotenv";
import signup from "./routes/signup";
import db from "./config/db";
dotenv.config();
const app = express();
const port = process.env.SERVER_PORT;
import signin from "./routes/signin";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import path from "path";
import pg from "pg";
import { Pool } from "pg";
app.use(express.json());

const pool = new pg.Pool({
  connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
});
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "jcxnvk@#I#@#RFIO2343rfn",
    resave: false,
    saveUninitialized: false,
    store: new pg.PgStore(),
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {});

app.post("/signup", signup);
app.post("/signin", signin);

app.listen(port, () => {
  console.log("Running on port http://localhost:3000/");
});
