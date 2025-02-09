import express, { query, Request, Response } from "express";
import dotenv from "dotenv";
import signup from "./routes/signup";
import db from "./config/db";
dotenv.config();
const app = express();
const port = process.env.SERVER_PORT;
import bodyParser from "body-parser";

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {});

app.post("/signup", signup);

app.listen(port, () => {
  console.log("Running on port http://localhost:3000/");
});
