import { Request, Response } from "express";
import bodyParser = require("body-parser");
import db from "../config/db";
import { config } from "dotenv";
import bcrypt from "bcrypt";
const saltRounds = 10;
const signup = async (req: Request, res: Response) => {
  const { fullname, email, password, confirmPassword } = req.body;

  const UserAuth_Data = (
    await db.query(`SELECT * FROM users WHERE email= $1`, [email])
  ).rows;
  if (UserAuth_Data.length > 0) {
    res.json({ message: "User already exists" });
  } else {
    try {
      if (password != confirmPassword) {
        console.log("Password don't match");
        res
          .status(400)
          .json({ message: "Either password or email is wrong, try again" });
      } else {
        if (password.length < 8) {
          res
            .status(400)
            .json({ message: "password should contain atleast 8 characters" });
        } else {
          const hasSpecialChars = /[!@#$%^&*()]/.test(password);
          const hasNumbers = /\d/.test(password);
          if (hasSpecialChars && hasNumbers) {
            bcrypt.hash(password, saltRounds, async function (err, hash) {
              await db.query(
                "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
                [fullname, email, hash]
              );
              res.status(201).json({ message: "Account created successfully" });
            });
          } else {
            res.status(400).json({
              message:
                "You password should contain special characters(!@#$%^&*())",
            });
          }
        }
      }
    } catch (error) {
      console.log("You account not created", error);
      res.status(400).json({ message: "Account not created, try again later" });
    }
  }
  console.log(UserAuth_Data);
};

export default signup;
