import { Request, Response } from "express";
import bodyParser = require("body-parser");
import db from "../config/db";
import { config } from "dotenv";
const signup = async (req: Request, res: Response) => {
  const { fullname, email, password, confirmPassword } = req.body;

  const UserAuth_Data = (
    await db.query(`SELECT * FROM users WHERE email= $1`, [email])
  ).rows;
  if (UserAuth_Data.length > 0) {
    res.json({ message: "User already exists" });
  } else {
    try {
      await db.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
        [fullname, email, password]
      );
      res.status(201).json({ message: "Account created" });
    } catch (error) {
      console.log("You account not created", error);
      res.status(400).json({ message: "Account not created, try again later" });
    }
  }
  console.log(UserAuth_Data);
};

export default signup;
