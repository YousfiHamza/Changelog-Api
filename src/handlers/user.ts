import { Request, Response, NextFunction } from "express";

import db from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";
import { CustomError } from "./error";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user;
    try {
      const password = await hashPassword(req.body.password);

      user = await db.user.create({
        data: {
          username: req.body.username,
          password,
        },
      });
    } catch (e) {
      return next(new CustomError("Error Creating a user!!", 400, [e]));
    }

    const token = createJWT(user);

    res.status(201).json({ username: user.username, token });
  } catch (err) {
    return next(new CustomError("Something Went Wrong Creating the user!", 500, [err]));
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await db.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return next(new CustomError("Wrong Credentials!", 401));
    }

    const isValidPassword = await comparePasswords(req.body.password, user!.password);

    if (!isValidPassword) {
      return next(new CustomError("Wrong Credentials!", 401));
    }

    const token = createJWT(user);

    res.status(200).json({ username: user.username, token });
  } catch (err) {
    console.log(err);
    return next(new CustomError("Something Went Wrong Signing In", 500, [err]));
  }
};
