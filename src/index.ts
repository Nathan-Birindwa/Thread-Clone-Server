import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import bodyParser from "body-parser";
import signup from "./routes/signup";
import signin from "./routes/signin";
import db from "./config/db";

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

const pool = new Pool({
  connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
});

const PgStore = connectPgSimple(session);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    store: new PgStore({ pool }),
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 200,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: any, done) => {
  console.log("Serializing User:", user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log("🔹 Deserializing User:", id);
    const response = await db.query("SELECT * FROM users WHERE id = $1", [id]);

    if (response.rows.length === 0) {
      return done(null, false);
    }

    done(null, response.rows[0]);
  } catch (error) {
    console.error("Deserialize Error:", error);
    done(error);
  }
});

app.get("/", async (req: Request, res: Response) => {
  res.send("Server is running!");
});

app.post("/signup", signup);
app.post("/signin", signin);

app.listen(port, () => {
  console.log(`Running on port http://localhost:${port}/`);
});
