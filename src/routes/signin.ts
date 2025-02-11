import bodyParser from "body-parser";
import { Request, Response } from "express";
import db from "../config/db";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// Auth middleware

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, cb) => {
    try {
      const response = await db.query(`SELECT * FROM users WHERE email = $1`, [
        email,
      ]);

      if (response.rows.length === 0) {
        return cb(null, false, { message: "Incorrect email or password." });
      }

      const user = response.rows[0];

      // Validate password using bcrypt
      const checkedPassword = await bcrypt.compare(password, user.password);
      if (!checkedPassword) {
        return cb(null, false, { message: "Incorrect email or password." });
      }

      return cb(null, user); // Authentication successful
    } catch (error) {
      return cb(error);
    }
  })
);

// Auth Controller (using passport )

const signin = (req: Request, res: Response, next: any) => {
  passport.authenticate("local", (err: Error, user: any, info: any) => {
    if (err)
      return res.status(500).json({ message: "Server error", error: err });

    if (!user)
      return res.status(401).json({ message: info?.message || "Unauthorized" });

    // Login the user and start a session
    req.logIn(user, (err) => {
      if (err)
        return res.status(500).json({ message: "Login failed", error: err });

      res.status(200).json({ message: "Login successful", user });
    });
  })(req, res, next);
};

export default signin;
