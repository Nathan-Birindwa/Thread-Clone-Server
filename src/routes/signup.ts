import { Request, Response } from "express";
const signup = (req: Request, res: Response) => {
  try {
    res.json("Hello World");
  } catch (error) {
    console.log("something happened ");
  }
};

export default signup;
