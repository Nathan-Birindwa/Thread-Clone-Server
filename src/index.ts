import express, { Request, Response } from "express";
import dotenv from "dotenv";
import signup from "./routes/signup";
const app = express();
dotenv.config();

const port = process.env.SERVER_PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.post("/signup", signup);

app.listen(port, () => {
  console.log("Running on port http://localhost:3000/");
});
